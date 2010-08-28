var _F = require("./Fight")
  , Fight = _F.Fight
  , FIGHTSTATUS = Fight.STATUS
  , Fighter = require("./Fighter")
  , queued = []
  , fights = []


function addFighter(fighter){
  console.log("addFighter")
  var q
  if (!queued.length){
    q = new Fight()
    queued = [q]
    q.on('start', function(){
      console.log("start emitted")
      fights.push(q)
      queued = []
    })
    q.on('end', function(fighters){
      console.log("end emitted")
      console.log("number of fighters: " + fighters.length)
      var len = fighters.length
      while (len--)
        addFighter(fighters[len])
      q = null     
    })
  }
  queued[0].add(fighter)
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
    console.dir(arguments)
  }

}

