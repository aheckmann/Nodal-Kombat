 
require.paths.unshift(
  __dirname + '/support/express/support/connect/lib/'
, __dirname + '/support/jade/lib/'
, __dirname + '/support/node-formidable/lib/formidable/'
)

var express = require('./support/express')
  , http = require('http')
  , io = require("./support/socketio")

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


// run it!
console.log("running on http://127.0.0.1:3000/")
app.listen(3000)

process.on("uncaughtException", function(err){
  console.warn("Caught unhandled exception:")
  console.warn(err.stack || err)    
})

