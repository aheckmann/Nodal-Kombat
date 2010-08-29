
var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , cookieParser = require("../support/express/support/connect/lib/connect/utils").parseCookie
  , sys = require("sys")
	, Leaderboard = require("./leaderboard").Leaderboard
	, lb = new Leaderboard()
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
  switch(event.method){
    case "gameover":
      this.emit("gameover")
      break;
    case "die":
      console.log("%s killed %s", event.args[0], this.uid)
			lb.kill(event.args[0])
    default:
      this.emit("event", event, this)
  }
}

