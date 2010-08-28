
var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , cookieParser = require("../support/express/support/connect/lib/connect/utils").parseCookie
  , sys = require("sys")
  , encode = require("./utils/encode")

module.exports = Fighter

function Fighter(client){
  client.removeAllListeners("message")
  client.on("message", this.handleMsg.bind(this))
  client.on("disconnect", this.quit.bind(this))
	cookies = cookieParser(client.request.headers.cookie)
  this.userkey = cookies.userkey
  this.avatar  = cookies.avatar
  this.client = client
  this.__defineGetter__("uid", function(){ return client.sessionId })
  this.client.send(encode({ method: "receiveid", args:[client.sessionId] }))
}
sys.inherits(Fighter, EventEmitter)


Fighter.prototype.send = function(msg){
  this.client.send(msg)
}

Fighter.prototype.quit = function(){
  console.log("No fair, I quit!")
  this.emit("quit")
}

Fighter.prototype.handleMsg = function(event){
  // we only look for gameover events, otherwise just
  // pass thru to other fighters
  
  if ("gameover" == event.method)
    this.emit("gameover")
  else
    this.emit("event", event, this)
}

