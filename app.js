 
require.paths.unshift(__dirname + '/support/express/support/connect/lib/',
                      __dirname + '/support/jade/lib/',
                      __dirname + '/support/express/support/connect/support/sass/lib/',
                      __dirname + '/support/node-formidable/lib/formidable/',
                      __dirname + '/support/connect-basic-auth/lib',
                      __dirname + '/support/ext/lib'); //temporary



var express = require('./support/express')
  , http = require('http')

var app = express.createServer(
  express.cookieDecoder()
, express.bodyDecoder()
, express.staticProvider(__dirname + '/public')
);

app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  res.render('index.jade', { locals: { name: "knockout" } } );    
})


app.listen(3000);
