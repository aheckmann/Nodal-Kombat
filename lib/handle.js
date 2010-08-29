var _F = require("./Fight")
  , Fight = _F.Fight
  , FIGHTSTATUS = Fight.STATUS
  , Fighter = require("./Fighter")
  , queued = []
  , fights = []

module.exports = {
  incomingMsg: function(msg, client){
    console.log("recieved websocket msg: " + msg)
    msg = msg || "noop"
    console.dir(msg)
    switch(msg){
      case "join":
        addFighter(new Fighter(client))
        break;
      case "watch":
        console.log("client requests to watch a game")
        break;
    }
  }
, disconnect: function(client){
    console.log("client " + client.sessionId + " disconnected")
  }
}

function addFighter(fighter){
  console.log("addFighter")
  var fight
  if (!queued.length){
    queued.push(fight = new Fight())
    fight.on('start', function(){
      console.log("start emitted")
      fights.push(queued.pop())
    })
    fight.on('end', function(fighters){
      console.log("end emitted")
      // let the fighters opt in to playing again
      // wait for a "join" event again
      var fighter
      while (fighter = fighters.pop()){
        console.log("remove message listener")
        fighter.removeAllListeners("event")
        fighter.removeAllListeners("quit")
        fighter.removeAllListeners("gameover")
        ;(function(fighter){
          var client = fighter.client
          fighter.client = null
          client.on("message", function(msg){
            module.exports.incomingMsg(msg, client)
          })
        })(fighter)
      }
      
      fight = null
    })
  }
  else 
    fight = queued[0]

  fight.add(fighter)
}


