var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var http = require('http');
var adminDb = require('./utils/adminDb');
//var bodyParser = require('body-parser');

var winston = require('winston');
require('winston-loggly');
winston.add(winston.transports.Loggly, {
    token: "ee7f0a0c-5fa1-4b3a-b334-8add60746351",
    subdomain: "laifharwood",
    tags: ["Winston-NodeJS"],
    json:true
});

app.use('/*', function(req, res, next){
  req.winston = winston;
  req.adminDb = adminDb;
  next();
})


app.use(cookieParser());

//app.use('/', express.static(__dirname + '/publicInstall'));
// app.use('/', function(req, res){
//   res.send('farts');
// });

app.use(function(req, res, next){
  if(req.url.indexOf('/webhook') > -1){
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){
      req.rawBody += chunk;
    });
    req.on('end', function(){
      next();
    });
  }else{
    next();
  }
});

app.use(require('./routes'));

// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//test
var server = http.createServer(app);

server.listen(process.env.PORT || 8080);
