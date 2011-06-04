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
      
      new Ajax.Updater('css-form', '/css-form.html', {
        onComplete: function(){
          $('css-text').value = buildCSS()
        }
      })
    }
    
    if(!window.cached && !app.authenticated){
      setTimeout(function(){
        new Ajax.Request('/cache', {
          parameters: { file: "index.html", body: document.body.innerHTML }
        });  
      }, 1000);
    }
  }
})

})