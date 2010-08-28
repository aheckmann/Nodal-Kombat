var app = module.parent.exports
  , io = require("../support/socketio")
  , handle = require("../lib/handle")

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

