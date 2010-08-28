
var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , sys = require("sys")

var Fighter = module.exports = function(client){
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

