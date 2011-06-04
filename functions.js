function submitForm(form) {
  new Ajax.Request('/logs', {
    parameters: { text: $('text').value }
  })
  return false;
}
