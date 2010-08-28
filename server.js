global.MAX_FIGHTERS = 10


require.paths.unshift(
  __dirname + '/support/express/support/connect/lib/'
, __dirname + '/support/express/support/jade/lib/'
, __dirname + '/support/redis-node-client/lib'
, __dirname + '/support/connect-auth/lib'
, __dirname + '/support/node-oauth/lib'
, __dirname + '/support/node-formidable/lib/formidable/'
)

var express = require('./support/express')
  , http = require('http')
  , sys = require('sys')
  , io = require("./support/socketio")
  , handle = require("./lib/handle")
	, connect = require('connect')
	, auth= require('auth')
	, OAuth= require('oauth').OAuth;

require("./lib/redis")


var app = express.createServer(
  express.errorHandler({ dumpExceptions: true, showStack: true})
, express.logger()
, express.cookieDecoder()
, express.bodyDecoder()
, express.staticProvider(__dirname + '/public')
)


// setting up Twitter + OAuth
try {
  var example_keys= require('./keys_file');
  for(var key in example_keys) {
    global[key]= example_keys[key];
  }
  console.log('Auth key data read.');
	app.use(connect.session());	
	app.use(auth( [
	  auth.Twitter({consumerKey: twitterConsumerKey, consumerSecret: twitterConsumerSecret})
	]) );
  console.log('Twitter auth enabled');
	var oa= new OAuth("http://twitter.com/oauth/request_token",
	                  "http://twitter.com/oauth/access_token",
	                  twitterConsumerKey,
	                  twitterConsumerSecret,
	                  "1.0",
	                  null,
	                  "HMAC-SHA1");
}
catch(e) {
  console.log('Unable to locate the keys_file.js file.  Please copy and ammend the example_keys_file.js as appropriate');
  console.log(sys.inspect(e));
  return;
}


app.configure(function(){
  app.set('views', __dirname + '/views')
})


require("./lib/routes")(app)

// sockets 
var sock = io.listen(app)
sock.on("connection", function(client){
  client.on("message", function(msg){
    handle.incomingMsg(msg, client)
  })
  client.on("disconnect", function(){
    handle.disconnect(client)
  })
})

// run it!
console.log("running on http://127.0.0.1:3000/")
app.listen(3000)

process.on("uncaughtException", function(err){
  console.warn("Caught unhandled exception:")
  console.warn(err.stack || err)    
})

