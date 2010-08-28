var uid = require("../support/express/support/connect/lib/connect/utils").uid
  , EventEmitter = require("events").EventEmitter
  , sys = require("sys")

var STATUS = module.exports.STATUS = {
  QUEUED: 0
, COUNTDOWN: 1
, INPROGRESS: 2
, OVER: 3 
}


var Fight = module.exports.Fight = function(){
  console.warn("new Fight")
  this.id = uid()
  this.status = STATUS.QUEUED
  this.fighters = []
  this._countdown = null
}
sys.inherits(Fight, EventEmitter)


Fight.prototype.add = function(fighter){
  console.log("fight.add")
  this.fighters.push(fighter)
  fighter.on("quit", this.remove.bind(this, fighter))
  fighter.on("event", this.handleEvent.bind(this))
  fighter.on("gameover", this.end.bind(this))
  if (STATUS.QUEUED === this.status && this.fighters.length > 1)
    this.countdown()
  else if (global.MAX_FIGHTERS === this.fighters.length)
    this.start()
}

Fight.prototype.remove = function(who){
  var fighters = this.fighters
    , len = fighters.length
    , fighter
  while (len--){
    fighter = fighters[len]
    if (fighter.uid == who.uid){
      if (STATUS.COUNTDOWN === this.status){
        clearTimeout(this._countdown)
        this._countdown = null
        this.status = STATUS.QUEUED
      }
      fighters.splice(len, 1)
      fighter.removeAllListeners("quit")
      console.log("fighter removed (%s)", who.uid)
      console.log("remaining fighters in fight: " + this.fighters.length)
      break;
    }
  }
  return who
}

// starts the fight countdown
Fight.prototype.countdown = function(){
  console.log("fight.countdown")
  var seconds = global.FIGHT_COUNTDOWN_SECS
  this.status = STATUS.COUNTDOWN
  this._countdown = setTimeout(this.start.bind(this), 1000 * seconds)

  var self = this
  function printCountdown(){ 
    if (!self._countdown) return
    self.notify({ method: "countdown", args:[seconds--]})
    console.log(seconds)
    if (seconds)
      setTimeout(printCountdown, 1000)
  }
  printCountdown()
}

// starts the fight
Fight.prototype.start = function(){
  console.log("fight.start")
  clearTimeout(this._countdown)

  this.add = function(){ 
    console.warn("Tried adding fighter to a fight in progress!")
  }

  this.status = STATUS.INPROGRESS 

  // Notify all fighters that fight has started
  this.notify({ method: "start" })
  this.emit('start')
}

// broadcasts msg to all fighters
Fight.prototype.notify = function(msg, eventSource){
  console.log("fight.notify")
  console.dir(msg)
  var fighters = this.fighters
    , len = fighters.length
  while (len--) if (fighters[len] != eventSource) {
    fighters[len].send(encode(msg))
  }
}

Fight.prototype.handleEvent = function(event, fighter){
  console.log("Fight#handleEvent: " + event.method)
  this.notify(event, fighter)
}

// ends the fight
Fight.prototype.end = function(){
  console.log("fight.end")
  this.status = STATUS.OVER
  this.notify({ method: "status", args: ["gameover"] } )
  this.emit('end', this.fighters)
}

function encode(event){
  // function to call
  // array of args
  //console.log("encoding:")
  //console.dir(event)
  if (!(event && event.method)) return ""

  if (!(event.args && event.args.length))
    return event.method 

  return event.method += "#" + event.args

  /*
  var event = 
  { type: "jump"
  , args: 
    [ 49
    , 32
    ]
  }

  */
}
