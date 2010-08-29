var app = module.parent.exports
var sys = require('sys')
var Leaderboard = require("./leaderboard").Leaderboard
var lb = new Leaderboard()


app.get('/', function(req, res){
	lb.killers(function(killers){
		lb.killcounts(killers, function(results){
			if(req.cookies.userkey !== undefined) {
				lb.status(req.cookies.userkey, function(rank, score){
					res.render('index.jade', { locals: { name: "knockout", 
																							 user: req.cookies.name,
																							 avatar: req.cookies.avatar,
																							 rank: rank,
																							 score: score,
																							 kcounts: results,
																							 killers: killers } } )

				})
			} else {
				res.render('index.jade', { locals: { name: "knockout", 
																						 user: req.cookies.name,
																						 avatar: req.cookies.avatar,
																						 rank: null,
																						 score: null,
																						 kcounts: results,
																						 killers: killers } } )
			}
			
		})
	})
})

app.get("/lbtest", function(req,res){
	lb.killers(function(killers){
		lb.killcounts(killers, function(results){
			console.log("results: " + sys.inspect(results))
		})

		res.writeHead(200)
		res.end()
	})	
})

app.get("/arena", function(req, res){
  if(req.cookies.userkey !== undefined) {
		lb.status(req.cookies.userkey, function(rank, score){
			console.log("Rank: "+ rank)
			console.log("Score: "+ score)
			res.render('arena.jade', { layout: "layout.arena.jade", locals: { name: "knockout", 
																					 user: req.cookies.name,
																					 avatar: req.cookies.avatar,
																					 rank: rank,
																					 score: score,
																					 killers: [] } } )
			
		})
	} else {
		res.render('arena.jade', { layout: "layout.arena.jade", locals: { name: "knockout", 
																				 user: req.cookies.name,
																				 avatar: req.cookies.avatar,
																				 rank: null,
																				 score: null,
																				 killers: [] } } )
	}
})

app.post('/login', function(req, res, params) {
  req.authenticate(['janrain'], function(error, authenticated) { 
    res.writeHead(200, {'Content-Type': 'text/html'})
		var theUser = req.getAuthDetails()
		var userKey = theUser.user.providerName + "|" + theUser.user.preferredUsername + "|" + theUser.user.email
		console.log("User Key: "+ userKey)
		redis.get(userKey, function (err, value) {
    	if (err) throw new Error(err)
		  console.log("Found: " + sys.inspect(value))
			redis.set(userKey, JSON.stringify(theUser), function (err, value) {
	    	if (err) throw new Error(err)
			  console.log("Real value: " + sys.inspect(theUser))	
			  console.log("Set to: " + sys.inspect(JSON.stringify(theUser)))
			});
			redis.incr("loginCount", function (err, value) {
	    	if (err) throw new Error(err)
			  console.log("a login occured! Total logins: " + value)
			});
			redis.sadd("uniqueLogins", userKey, function (err, value) {
	    	if (err) throw new Error(err)
			  console.log("new to uniqueLogins? "+ value)
			});
			redis.zadd("leaderboard", 0, userKey, function (err, value) {
	    	if (err) throw new Error(err)
			  console.log("Placed on the leaderboard: "+ value)
			});
		});
		res.writeHead(301, [
		    ['Location', '/'],
		    ['Content-Type', 'text/plain'],		
		    ['Set-Cookie', 'userkey='+userKey],
		    ['Set-Cookie', 'avatar='+theUser.user.photo],		
		    ['Set-Cookie', 'name='+theUser.user.preferredUsername]
		]);
		res.end()
  });
})

app.get('/ohai-redis', function(req, res){
  redis.info(function (err, info) {
    if (err) throw new Error(err)
    res.send("Redis Version is: " + info.redis_version);
    res.end()
  });
  redis.flushdb();
});


