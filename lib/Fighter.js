
var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , sys = require("sys")

var Fighter = module.exports = function(client){
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
  console.log("handleMsg " + message)
  
  // we only look for gameover events, otherwise just
  // pass thru to other fighters
  
  if ("gameover" == message)
    this.emit("gameover")
  else
    this.emit("event", message)

  // don't use JSON.parsing, too slow
  // "e:jump#x=40_y=400_p=60|e:punch|e:gameover"
  //
  /* move this to the client
  var msg = (message || "").split("|")
    , tok
  while (tok = msg.shift()){
    tok = tok.split(":")
    switch (tok[0]){
      case "gameover":
        this.emit("gameover")
        break;
      default:
        this.emit("event", tok[1])
    }
  }
  */
}

