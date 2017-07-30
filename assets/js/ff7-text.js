(function(window) {

  TEXT_SPEED = 1000 / 30;
  CHARS_TO_WRITE_PER_FRAME = 2;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function breakLines(str) {
    return escapeHtml(str).replace(/(\r\n|\n|\r)/gm, '<br>');
  }

  function wrapNode(node) {
    if(node.nodeType == 3 && node.textContent.trim().length !== 0) {
      wrapTextNode(node);
    }
    else
    {
      var childNodes = [];
      for(var i = 0; i<node.childNodes.length; i++) {
        childNodes.push(node.childNodes[i]);
      }
      childNodes.forEach(function(node) {
        wrapNode(node);
      });
    }
  }

  function wrapTextNode(textNode) {
    var spanNode = document.createElement('span');
    spanNode.setAttribute('class', 'text hidden');
    var newTextNode = document.createTextNode(textNode.textContent);
    spanNode.appendChild(newTextNode);
    textNode.parentNode.replaceChild(spanNode, textNode);
    var visibleSpanNode = document.createElement('span');
    visibleSpanNode.setAttribute('class', 'text visible');
    spanNode.parentNode.insertBefore(visibleSpanNode, spanNode);
  }

  function writeText(element, onComplete) {
    var visibleSpans = element.querySelectorAll('.text.visible');
    if(visibleSpans.length == 0) {
      return;
    }
    var index = 0;
    var timeout = setInterval(function() {
      var visibleSpan = visibleSpans[index];
      var invisibleSpan = visibleSpan.nextSibling;
      if(invisibleSpan.textContent.length != visibleSpan.textContent.length) {
        var nextChar = invisibleSpan.textContent.substr(
          visibleSpan.textContent.length, CHARS_TO_WRITE_PER_FRAME);
          visibleSpan.textContent += nextChar;
        } else {
          index++;
          if(index == visibleSpans.length) {
            clearTimeout(timeout);
            if(onComplete) {
              onComplete();
            }
          }
        }
      }, TEXT_SPEED);
    }

	window.FF7.text = {
		write: function(element, onComplete) { writeText(element, onComplete) },
    init: function(element) { wrapNode(element); },
    breakLines: function(text) { return breakLines(text); }
	}

})(window);
