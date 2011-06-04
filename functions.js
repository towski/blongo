function submitForm(form) {
  var location = document.location.href
  var id = document.location.search.slice(1).toQueryParams().id
  if(id){
    new Ajax.Request('/logs/'+id, {
      parameters: { text: $('text').value, id: $('id').value },
      onSuccess: function(){
        document.location.href = location
      }
    })
  }else{
    new Ajax.Request('/logs', {
      parameters: { text: $('text').value },
      onSuccess: function(){
        document.location.href = "/"
      }
    })
  }
  return false;
}
