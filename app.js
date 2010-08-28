 
require.paths.unshift(
  __dirname + '/support/express/support/connect/lib/'
, __dirname + '/support/jade/lib/'
, __dirname + '/support/node-formidable/lib/formidable/'
)

var express = require('./support/express')
  , http = require('http')

var app = express.createServer(
  express.logger()
, express.cookieDecoder()
, express.bodyDecoder()
);

app.configure(function(){
  app.set('views', __dirname + '/views')
});

app.get('/', function(req, res){
  res.render('index.jade', { locals: { name: "knockout" } } );    
})


app.use(express.staticProvider(__dirname + '/public'))
app.listen(3000);
