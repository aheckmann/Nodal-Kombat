var _F = require("./Fight")
  , Fight = _F.Fight
  , FIGHTSTATUS = Fight.STATUS
  , Fighter = require("./Fighter")
  , queued = []
  , fights = []


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
      console.log("number of fighters: " + fighters.length)
      var fighter
      while (fighter = fighters.pop())
        addFighter(fighter)
      fight = null     
    })
  }
  else 
    fight = queued[0]

  fight.add(fighter)
}

module.exports = {

  incomingMsg: function(msg, client){
    console.log("recieved websocket msg: " + msg)

    try {
      msg = JSON.parse(msg)
      console.log("parsed!")
      console.dir(msg)
      msg.type = msg.type || "noop"
      switch(msg.type){
        case "join":
          addFighter(new Fighter(client))
          break;
      }
        
    } catch (err) {
      console.dir(err.stack || err)
    }

  }
, disconnect: function(client){
    console.log("client " + client.sessionId + " disconnected")
  }

}

