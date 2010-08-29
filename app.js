global.MAX_FIGHTERS = 10
global.FIGHT_COUNTDOWN_SECS = 3 // 30

require.paths.unshift(
  __dirname + '/support/express/support/connect/lib/'
, __dirname + '/support/express/support/jade/lib/'
, __dirname + '/support/redis-node-client/lib'
, __dirname + '/support/connect-auth/lib'
, __dirname + '/support/node-oauth/lib'
, __dirname + '/support/node-formidable/lib/formidable/'
)

var express = require('./support/express')

var app = module.exports = express.createServer(
  express.errorHandler({ dumpExceptions: true, showStack: true})
, express.conditionalGet()
, express.logger()
, express.cookieDecoder()
, express.bodyDecoder()
, express.staticProvider(__dirname + '/public')
//, express.staticProvider(__dirname + '/static')
)

app.configure(function(){
  app.set('views', __dirname + '/views')
})
.error(function(err, req, res, next){
  console.dir(err)
  if (!err || 2 !== err.errno)
    return res.render("500.jade", function(err, content){
      res.send(content || "uhh, Look over there!", 500)  
    })
  res.render("404.jade", { layout: false }, function(err, content){
    res.send(content || "aaaaaah!! I've been shot!", 404)  
  })
})

require("./lib/redis")
require("./lib/oauth")
require("./lib/routes")
require("./lib/sockets")

// never crash
process.on("uncaughtException", function(err){
  console.warn("Caught unhandled exception:")
  console.warn(err.stack || err)    
})
