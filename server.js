global.MAX_FIGHTERS = 10
global.FIGHT_COUNTDOWN_SECS = 10 // 30

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
, express.logger()
, express.cookieDecoder()
, express.bodyDecoder()
, express.staticProvider(__dirname + '/public')
)

app.configure(function(){
  app.set('views', __dirname + '/views')
})

require("./lib/redis")
require("./lib/oauth")
require("./lib/routes")
require("./lib/sockets")

console.log("running on http://127.0.0.1:3000/")
app.listen(3000)


// never crash
process.on("uncaughtException", function(err){
  console.warn("Caught unhandled exception:")
  console.warn(err.stack || err)    
})
