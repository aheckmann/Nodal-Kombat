
require.paths.unshift(
  __dirname + '/support/express/support/connect/lib/'
, __dirname + '/support/jade/lib/'
, __dirname + '/support/redis-node-client/lib',
, __dirname + '/support/node-formidable/lib/formidable/'
)
 
var express = require('./support/express')
  , redis_client = require('redis-client')
  , http = require('http')
  , io = require("./support/socketio")

var redis = redis_client.createClient(9227, "goosefish.redistogo.com")
var dbAuth = function() { redis.auth('0cf510f78c1288170fed3dfb436bd9fb'); }
redis.addListener('connected', dbAuth);
redis.addListener('reconnected', dbAuth);
dbAuth();

var app = express.createServer(
  express.errorHandler({ dumpExceptions: true, showStack: true})
, express.logger()
, express.cookieDecoder()
, express.bodyDecoder()
, express.staticProvider(__dirname + '/public')
)


var sock = io.listen(app)
sock.on("connection", function(client){
  client.on("message", function(msg){
    console.log("recieved websocket msg: " + msg)
    client.send("what up?!")
  })
  client.on("disconnect", function(){
    console.log("client disconnected")
  })
})

app.configure(function(){
  app.set('views', __dirname + '/views')
})



// routes
app.get('/', function(req, res){
  res.render('index.jade', { locals: { name: "knockout" } } )
})

app.get('/ohai-redis', function(req, res){
	redis.info(function (err, info) {
	    if (err) throw new Error(err)
			redis.close()
			res.send("Redis Version is: " + info.redis_version);
			res.end()
	});
});


// run it!
console.log("running on http://127.0.0.1:3000/")
app.listen(3000)

process.on("uncaughtException", function(err){
  console.warn("Caught unhandled exception:")
  console.warn(err.stack || err)    
})

