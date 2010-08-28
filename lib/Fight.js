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
  this.id = uid()
  this.status = STATUS.QUEUED
  this.fighters = []
  this._countdown = null
  console.log("new Fight")
}

sys.inherits(Fight, EventEmitter)

Fight.prototype.add = function(fighter){
  console.log("fight.add")
  this.fighters.push(fighter)
  if (STATUS.QUEUED === this.status && this.fighters.length > 1)
    this.countdown()
  else if (global.MAX_FIGHTERS === this.fighters.length)
    this.start()
}

// starts the fight countdown
Fight.prototype.countdown = function(){
  console.log("fight.countdown")
  this.status = STATUS.COUNTDOWN
  this._countdown = setTimeout(this.start.bind(this), 30000)
  var i = 30
    , fn = function(){ 
        console.log(i--)
        if (i)
          setTimeout(fn, 1000)
      }
  fn()


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
  this.notify({ status: "start" })
  this.emit('start')
}

// broadcasts msg to all fighters
Fight.prototype.notify = function(msg){
  console.log("fight.notify")
  console.dir(msg)
  var fighters = this.fighters
    , len = fighters.length
  while (len--)
    fighters[len].send(msg)
}

// ends the fight
Fight.prototype.end = function(){
  console.log("fight.end")
  this.status = STATUS.OVER
  this.notify({ status: "gameover" })
  this.emit('end', this.fighters)
}
