var sys = require("sys")

var Leaderboard = module.exports.Leaderboard = function(){
}

Leaderboard.prototype.status = function(userkey, callback){
	var self = this
	global.redis.zrevrank("leaderboard", userkey, function (err, rank) {
	  self.score(userkey, function(err, scr){
		  callback(rank, scr)
		})
	});
}

Leaderboard.prototype.kill = function(userkey){
	//console.log("Leaderboard reflecting kill for "userkey)
	global.redis.zincrby("leaderboard", 1, userkey, function (err, value) {
	  console.log("New kill for " + userkey + ": " + sys.inspect(value))
	});
}

Leaderboard.prototype.killers = function(callback){
	var self = this
	global.redis.zrevrange("leaderboard", 0, 4, function (err, value) {
		redis.mget(value, function (err2, value2) {
		  callback(value2)
		});
	});
}

Leaderboard.prototype.score = function(userkey, callback){
  redis.zscore("leaderboard", userkey, function (err, value) {
	  callback(err, value)
	});	
}

Leaderboard.prototype.multiscore = function(userkey, accum, callback){
  redis.zscore("leaderboard", userkey, function (err, value) {
	  accum[userkey] = value
	  callback(err, accum, value)
	});	
}

Leaderboard.prototype.killcounts = function(jsons, callback){
	var self = this	
	var pending = jsons.length
	var kcounts = {}
	var i = 0
	for(; i<pending;++i){
		var killer = JSON.parse(jsons[i])
		var uk = killer.user.providerName + "|" + killer.user.preferredUsername + "|" + killer.user.email		
		self.multiscore(uk, kcounts, function(err, accum, killcount){
			if (!--pending)
				callback(kcounts)
		})
	}
}
