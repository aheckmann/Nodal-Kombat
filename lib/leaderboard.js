var sys = require("sys")

var Leaderboard = module.exports.Leaderboard = function(){
  console.warn("new Leaderboard")
}

Leaderboard.prototype.status = function(userkey, callback){
	var self = this
	console.log("Checking status for "+ userkey)
	global.redis.zrevrank("leaderboard", userkey, function (err, rank) {
	  self.score(userkey, function(err, scr){
		  callback(rank, scr)
		})
	});
}

Leaderboard.prototype.kill = function(fighter){
	console.log("Leaderboard reflecting kill for "+fighter.userkey)
	global.redis.zincrby("leaderboard", 1, fighter.userkey, function (err, value) {
	  console.log("New kill for " + fighter.userkey + ": " + sys.inspect(value))
	});
}

Leaderboard.prototype.killers = function(callback){
	var self = this
	global.redis.zrevrange("leaderboard", 0, 4, function (err, value) {
	  console.log("Leaderboard asked for killers")
	  console.log("zrange returning: "+sys.inspect(value))
		redis.mget(value, function (err2, value2) {
		  console.log("mget returns: " + sys.inspect(value2))
		  var retvals = {}
			for (var i = 0, n = value2.length; i < n; i++) {
				var k = JSON.parse(value2[i])
			  var userKey = k.user.providerName + "|" + k.user.preferredUsername + "|" + k.user.email				
			 	self.score(userKey, function(err, scr){
				  retvals[k] = scr
				  console.log("retvals updated: "+ sys.inspect(retvals))
				})
			}
			console.log("composed retvals: " + sys.inspect(retvals))
		  callback(err2, retvals)
		});
	});
}

Leaderboard.prototype.score = function(userkey, callback){
  redis.zscore("leaderboard", userkey, function (err, value) {
	  console.log("Leaderboard zscore for " + userkey + ": " + value)
	  callback(err, value)
	});	
}