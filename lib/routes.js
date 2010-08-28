var app = module.parent.exports
var sys = require('sys')


app.get('/', function(req, res){
  res.render('index.jade', { locals: { name: "knockout" } } )
})

app.get('/home', function(req, res){
  res.render('home.jade', { locals: { body_id: "index" } } )
})

app.get ('/auth/twitter', function(req, res, params) {
  req.authenticate(['twitter'], function(error, authenticated) { 
    if( authenticated ) {
      // oa.getProtectedResource("http://twitter.com/statuses/user_timeline.xml", "GET",
      //                         req.getAuthDetails()["twitter_oauth_token"], req.getAuthDetails()["twitter_oauth_token_secret"],  function (error, data) {
        res.send("You logged in as: " + req.getAuthDetails().user.username);
        res.end()
      // });
    }
    else {
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.end("<html><h1>Twitter authentication failed :( </h1></html>")
    }
  });
})

app.post('/login', function(req, res, params) {
  req.authenticate(['janrain'], function(error, authenticated) { 
    res.writeHead(200, {'Content-Type': 'text/html'})
		theUser = req.getAuthDetails()
		userKey = theUser.user.providerName + "|" + theUser.user.preferredUsername + "|" + theUser.user.email
		console.log("User Key: "+ userKey)
		redis.get(userKey, function (err, value) {
    	if (err) throw new Error(err)
		  console.log("Found: " + sys.inspect(value))
			redis.set(userKey, theUser, function (err, value) {
	    	if (err) throw new Error(err)
			  console.log("Set to: " + sys.inspect(theUser))
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
		res.redirect('/', 301);
		res.end()
  });
})

app.get('/ohai-redis', function(req, res){
  redis.info(function (err, info) {
    if (err) throw new Error(err)
    redis.close()
    res.send("Redis Version is: " + info.redis_version);
    res.end()
  });
});


