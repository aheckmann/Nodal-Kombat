
var connect = require('connect')
	, auth= require('auth')
	, OAuth= require('oauth').OAuth
  , example_keys= require('../keys_file')
  , sys = require('sys')
  , app = module.parent.exports

// setting up Twitter + OAuth
try {
  for(var key in example_keys) {
    global[key]= example_keys[key];
  }
  console.log('Auth key data read.');
	app.use(connect.session());	
	app.use(auth( [
	  auth.Twitter({consumerKey: twitterConsumerKey, consumerSecret: twitterConsumerSecret})
    , auth.Janrain({apiKey: janrainApiKey, appDomain: janrainAppDomain, callback: janrainCallbackUrl})	
	]) );
  console.log('Twitter auth enabled');
	var oa= new OAuth("http://twitter.com/oauth/request_token",
	                  "http://twitter.com/oauth/access_token",
	                  twitterConsumerKey,
	                  twitterConsumerSecret,
	                  "1.0",
	                  null,
	                  "HMAC-SHA1");
}
catch(e) {
  console.log('Unable to locate the keys_file.js file.  Please copy and ammend the example_keys_file.js as appropriate');
  console.log(sys.inspect(e));
  return;
}


