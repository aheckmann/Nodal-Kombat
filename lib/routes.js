var app = module.parent.exports


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

app.get('/ohai-redis', function(req, res){
  redis.info(function (err, info) {
    if (err) throw new Error(err)
    redis.close()
    res.send("Redis Version is: " + info.redis_version);
    res.end()
  });
});


