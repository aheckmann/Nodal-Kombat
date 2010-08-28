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
  , io = require("./support/socketio")
  , handle = require("./lib/handle")



var app = module.exports = express.createServer(
  express.errorHandler({ dumpExceptions: true, showStack: true})
, express.logger()
, express.cookieDecoder()
, express.bodyDecoder()
, express.staticProvider(__dirname + '/public')
)

app.configure(function(){
  app.set('views', __dirname + '/views')
})

require("./lib/redis")
require("./lib/oauth")
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

// never crash
process.on("uncaughtException", function(err){
  console.warn("Caught unhandled exception:")
  console.warn(err.stack || err)    
})
