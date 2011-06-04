var http = require('http');
var mongodb = require('mongodb')
var fs = require('fs')
var qs = require('qs')
var url = require('url')

if(process.env.NODE_ENV == "local"){
  var config = JSON.parse(fs.readFileSync('config.json.local'))
}else{
  var config = JSON.parse(fs.readFileSync('config.json'))
}
var mongo_config = config.mongo

mongodb.connect(mongo_config, function(error, db){
  http.createServer(function (request, res) {
    var path = url.parse(request.url).pathname
    var method = request.method.toLowerCase()
    var params = qs.parse(url.parse(request.url).query)
    var cookies = {}
    if (request.headers.cookie) {
      _ref = request.headers.cookie.split(';')
      for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
        cookie = _ref[_i]
        parts = cookie.split('=')
        cookies[parts[0].trim()] = (parts[1] || '').trim()
      }
    }
    var authenticated
    if(config.password == unescape(cookies.password)){
      authenticated = true
    } else {
      authenticated = false
    }
    var match
    if(path == "/"){
      path = "/index.html"
    }
    if(path == "/application"){
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify({environment: config.environment, authenticated: authenticated}))
    } else if((match = path.match(/\/logs\/([a-f0-9]*)$/)) && method == "post" && authenticated){
      var content = ""
      request.addListener('data', function(chunk){
        content += chunk;
      });
      request.addListener('end', function(){
        var parsed = qs.parse(content)
        db.collection('logs', function(error, collection){
          collection.update({"_id": db.bson_serializer.ObjectID(match[1])}, {$set: {text: parsed.text}})  
        })
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end()
      });
    } else if(path == "/logs" && method == "post" && authenticated){
      var content = ""
      request.addListener('data', function(chunk){
        content += chunk;
      });
      request.addListener('end', function(){
        var parsed = qs.parse(content)
        db.collection('logs', function(error, collection){
          collection.insert(parsed)  
        })
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end()
      });
    } else if(path == "/log"){
      res.writeHead(200, {'Content-Type': 'application/json'})
      db.collection('logs', function(error, collection){
        collection.find({"_id": db.bson_serializer.ObjectID(params.id)}, {}).toArray(function(err, items){
          res.end(JSON.stringify(items[0]))
        })
      })
    } else if(path == "/logs"){
      res.writeHead(200, {'Content-Type': 'application/json'})
      db.collection('logs', function(error, collection){
        collection.find({}, {limit: 3, sort: {_id: -1}}).toArray(function(err, items){
          res.end(JSON.stringify({authenticated: authenticated, items:items}))
        })
      })
    } else if(path == "/cache" && method == "post"){
      var content = ""
      request.addListener('data', function(chunk){
        content += chunk;
      });
      request.addListener('end', function(){
        var parsed = qs.parse(content)
        fs.open('index.html.cached', 'w+', 0666, function(err, fd){
          var buffer = new Buffer("<html><head><script type='text/javascript'>var cached = true;</script>" + parsed.head + "</head><body>"+ parsed.body +"</body></html>")
          fs.write(fd, buffer, 0, buffer.length)
        })
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end()
      });
    } else {
      if(!path.match('config.json')){
        fs.stat("." + path + '.cached', function(err, stats){
          if(err || authenticated){
            fs.stat("." + path, function(err, stats){
              res.writeHead(200, {'Content-Type': 'text/html'})
              fs.readFile("." + path, function(err, data){
                res.end(data)
              })
            })
          } else {
            res.writeHead(200, {'Content-Type': 'text/html'})
            fs.readFile("." + path + '.cached', function(err, data){
              res.end(data)
            })
          }
        })
      }
    }
  }).listen(10331)
});
