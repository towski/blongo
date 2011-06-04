var http = require('http');
var mongodb = require('mongodb')
var fs = require('fs')
var mongo_config;

if(process.env.NODE_ENV == "local"){
  mongo_config = JSON.parse(fs.readFileSync('config.json.local')).mongo;
}else{
  mongo_config = JSON.parse(fs.readFileSync('config.json')).mongo;
}

mongodb.connect(mongo_config, function(error, db){
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\nApp (towski) is running..');
  }).listen(10331);
});
