
var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , sys = require("sys")

module.exports = Fighter

function Fighter(client){
  client.removeAllListeners("message")
  client.on("message", this.handleMsg.bind(this))
  client.on("disconnect", this.quit.bind(this))
  this.client = client
  this.__defineGetter__("uid", function(){ return client.sessionId })
}
sys.inherits(Fighter, EventEmitter)


Fighter.prototype.send = function(msg){
  this.client.send(msg)
}

Fighter.prototype.quit = function(){
  console.log("No fair, I quit!")
  this.emit("quit")
}

Fighter.prototype.handleMsg = function(message){
  // we only look for gameover events, otherwise just
  // pass thru to other fighters
  
  if ("gameover" == message)
    this.emit("gameover")
  else
    this.emit("event", message, this)
}

