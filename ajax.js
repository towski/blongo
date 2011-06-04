$(document).on('dom:loaded', function(){

new Ajax.Request('/application', {
  method: 'get',
  onSuccess: function(response){
    var app = response.responseJSON
    if(!window.cached){
      if($('logs')){
        new Ajax.Request('/logs', {
          onSuccess: function(response){ 
            var data = response.responseJSON
            var authenticated = data.authenticated
            data.items.each(function(object){
              var text = object.text
              var div = new Element('div', { 'class': 'log' }).update(text)
              div.insert({top: new Element('h2').update(object.title)})
              $('logs').appendChild(div)
              if(authenticated){
                var a = new Element('a', { 'href': '/edit.html?id=' + object._id  }).update("edit")
                $('logs').appendChild(a)
                var a = new Element('a', { 'href': '#' }).update(" destroy")
                a.on('click', function(){
                  var decision = confirm("Really destroy?");
                  if (decision == true){
                    new Ajax.Request('/destroy', {
                      method: 'get',
                      parameters: {id: object._id},
                      onSuccess: function(){
                        document.location.href = '/'
                      }
                    })
                  }
                })
                $('logs').appendChild(a)
              }
            })
          },
          method: "get"
        });
      }
    }
    
    if(app.authenticated){
      $(document.body).insert("<a class='authenticated' href='/new.html'>new</a>")
      
      if($('edit-form')){
        new Ajax.Request('/log', {
          method: "get",
          parameters: document.location.search.slice(1).toQueryParams(),
          onSuccess: function(response){
            var data = response.responseJSON
            $('text').value = data.text
            $('id').value = data._id
            $('title').value = data.title
            $('log').update(data.text)
            $('log').insert({top: new Element('h2').update(data.title)})
          }
        });
      }
      
      new Ajax.Updater('css-form', '/css-form.html', {
        onComplete: function(){
          $('css-text').value = buildCSS()
        }
      })
    }
    
    if(!window.cached && !app.authenticated){
      var path = document.location.pathname.slice(1)
      if(path == ""){
        var file = "index.html"
      } else {
        if(!path.match(/html$/)){
          var file = path + ".html"
        } else {
          var file = path
        }
      }
      setTimeout(function(){
        new Ajax.Request('/cache', {
          parameters: { file: file, body: document.body.innerHTML }
        });  
      }, 1000);
    }
  }
})

})