new Ajax.Request('/application', {
  method: 'get',
  onSuccess: function(response){
    var app = response.responseJSON
    if(app.environment == "local" || !window.cached || app.authenticated){
      if($('logs')){
        new Ajax.Request('/logs', {
          onSuccess: function(response){ 
            var data = response.responseJSON
            var authenticated = data.authenticated
            data.items.each(function(object){
              var text = object.text
              var div = new Element('div', { 'class': 'log' }).update(text);
              $('logs').appendChild(div);
              if(authenticated){
                var a = new Element('a', { 'href': '/edit.html?id=' + object._id  }).update("edit");
                $('logs').appendChild(a);
              }
            })
          },
          method: "get"
        });
      }
      
      if($('edit-form')){
        new Ajax.Request('/log', {
          method: "get",
          parameters: document.location.search.slice(1).toQueryParams(),
          onSuccess: function(response){
            var data = response.responseJSON
            $('text').value = data.text
            $('id').value = data._id
            $('log').update(data.text)
          }
        });
      }
    }
    
    if(app.environment != "local" && !window.cached && !app.authenticated){
      setTimeout(function(){
        new Ajax.Request('/cache', {
          parameters: { head: document.head.innerHTML, body: document.body.innerHTML }
        });  
      }, 1000);
    }
  }
})