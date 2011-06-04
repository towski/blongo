function submitForm(form) {
  var location = document.location.href
  var id = document.location.search.slice(1).toQueryParams().id
  if(id){
    new Ajax.Request('/logs/'+id, {
      parameters: $('edit-form').serialize(true),
      onSuccess: function(){
        document.location.href = location
      }
    })
  }else{
    new Ajax.Request('/logs', {
      parameters: $('new-form').serialize(true),
      onSuccess: function(){
        document.location.href = "/"
      }
    })
  }
  return false;
}


function changeCSS(className , propertyName , value) {
  if((className == '' ) || (propertyName == '' ) || (value == '' )) {
      return ;
  }
  
  var propertyIndexName = false;
  var falg = false;
  var numberOfStyles = document.styleSheets.length
  
  if (document.styleSheets[0]['rules']) {
    propertyIndexName = 'rules';
  } else if (document.styleSheets[0]['cssRules']) {
    propertyIndexName = 'cssRules';
  }
  
  for (var i = 0; i < numberOfStyles; i++) {
    for (var j = 0; j < document.styleSheets[i][propertyIndexName].length; j++) {
      if (document.styleSheets[i][propertyIndexName][j].selectorText == className) {
        if(document.styleSheets[i][propertyIndexName][j].style[propertyName]){
          document.styleSheets[i][propertyIndexName][j].style[propertyName] = value;
          falg=true;
          break;
        }
      }
    }
    if(!falg){
      if(document.styleSheets[i].insertRule){
        document.styleSheets[i].insertRule(className+' { '+propertyName+': '+value+'; }',document.styleSheets[i][propertyIndexName].length);
      } else if (document.styleSheets[i].addRule) {
        document.styleSheets[i].addRule(className,propertyName+': '+value+';');
      }
    }
  }
}

function buildCSS(){
  var content = ""
  $A(document.styleSheets[0]['rules']).each(function(rule){ 
    content += rule.cssText + "\n\n"
  })
  return content
}

function addCSS(){
  changeCSS($('css-style').value, $('css-property').value, $('css-value').value)
  $('css-text').value = buildCSS()
}

function submitCSS(){
  var location = document.location.href
  new Ajax.Request('/cache', {
    parameters: { file:"rules.css", body: $('css-text').value },
    onSuccess: function(){
      document.location.href = location
    }
  }); 
}