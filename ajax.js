new Ajax.Request('/logs', {
  onSuccess: function(response){ 
    var data = JSON.parse(response.responseText)
    data.each(function(object){
      var text = object.text
      var div = new Element('div', { 'class': 'log' }).update(text);
      $('logs').appendChild(div);
    })
  },
  method: "get"
});

new Ajax.Updater('form', '/form.html', {
  method: "get"
});
