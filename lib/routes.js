var app = module.parent.exports
var sys = require('sys')

app.get('/', function(req, res){
	console.log("req.cookies.userkey: "+req.cookies.userkey)
	res.render('index.jade', { locals: { name: "knockout", 
																			 user: req.cookies.name,
																			 avatar: req.cookies.avatar } } )
})

app.get('/home', function(req, res){
  res.render('home.jade', { locals: { body_id: "index" } } )
})

app.get("/arena", function(req, res){
  res.render("arena.jade", { locals: { body_id: "arena" }})
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


