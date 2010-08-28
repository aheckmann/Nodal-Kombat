
var redis_client = require('redis-client')

var redis = global.redis = redis_client.createClient(9227, "goosefish.redistogo.com")

var dbAuth = function() { redis.auth('0cf510f78c1288170fed3dfb436bd9fb'); }
redis.addListener('connected', dbAuth);
redis.addListener('reconnected', dbAuth);
dbAuth();
