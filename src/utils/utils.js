function createElement(html) {
  var div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

function createEvent(type) {
  var event = document.createEvent('Event');
  event.initEvent(type);
  return event;
}

export { createElement, createEvent };
