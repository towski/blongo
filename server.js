var http = require('http');
var mongodb = require('mongodb')
var fs = require('fs')
var qs = require('qs')
var url = require('url')
var mongo_config
var content = ""

if(process.env.NODE_ENV == "local"){
  mongo_config = JSON.parse(fs.readFileSync('config.json.local')).mongo
}else{
  mongo_config = JSON.parse(fs.readFileSync('config.json')).mongo
}

mongodb.connect(mongo_config, function(error, db){
  http.createServer(function (request, res) {
    var path = request.url
    var method = request.method.toLowerCase()
    var params = qs.parse(url.parse(request.url).query)
    if(path == "/"){
      path = "/index.html"
    }
    if(path == "/logs" && method == "post"){
      request.addListener('data', function(chunk){
        content += chunk;
      });
      request.addListener('end', function(){
        var parsed = qs.parse(content);
        db.collection('logs', function(error, collection){
          collection.insert(parsed)  
        })
        res.writeHead(200, {'Content-Type': 'text/json'})
        res.end()
      });
    } else if(path == "/logs"){
      res.writeHead(200, {'Content-Type': 'text/json'})
      db.collection('logs', function(error, collection){
        collection.find({}, {limit: 3, sort: {_id: -1}}).toArray(function(err, items){
          res.end(JSON.stringify(items))
        })
      })
    } else {
      fs.stat("." + path, function(err, stats){
        res.writeHead(200, {'Content-Type': 'text/html'})
        fs.readFile("." + path, function(err, data){
          res.end(data)
        })
      })
    }
  }).listen(10331)
});
