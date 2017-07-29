(function(window) {

  ANIMATION_SPEED = 25;
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

  function enableSelections(ff7Window, self) {
    ff7Window.addEventListener('keydown', _.throttle(function(e) {
      var KEY_CODE_UP = 38;
      var KEY_CODE_DOWN = 40;
      var KEY_CODE_ESC = 27;
      var KEY_CODE_ENTER = 13;
      var current = ff7Window.querySelector('li.selected');
      if(!current) {
        return;
      }
      if(e.keyCode === KEY_CODE_UP) {
        var prev = current.previousElementSibling || current.parentNode.lastElementChild;
        moveFinger(current, prev);
      } else if(e.keyCode == KEY_CODE_DOWN) {
        var next = current.nextElementSibling || current.parentNode.firstElementChild;
        moveFinger(current, next);
      } else if(e.keyCode == KEY_CODE_ENTER) {
        var option = current.ff7Option;
        if(option.action) {
          option.action(function() {
            self.hide();
          });
        }
      }
    }, 100, {trailing: false}));
  }

  function moveFinger(currentNode, newNode) {
    currentNode.classList.remove('selected');
    newNode.classList.add('selected');
    FF7.audio.playMenuSelect();
  }

  function animateWindowText(ff7Window, callback) {
    var visibleSpans = ff7Window.querySelectorAll('.text.visible');
    if(visibleSpans.length == 0)
    return;
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
            var selection = ff7Window.querySelector('li');
            if(selection) {
              selection.classList.add('selected');
              ff7Window.focus();
            }
            callback();
          }
        }
      }, TEXT_SPEED);
    }

    function setWindowSize(element, originalLeft, originalTop,
        originalWidth, originalHeight, scaleFactor) {
      var width = originalWidth * scaleFactor;
      var height = originalHeight * scaleFactor;
      var horizontalMargin = (originalWidth - width) / 2;
      var verticalMargin = (originalHeight - height) / 2;
      element.style.position = 'absolute';
      element.style.left = (originalLeft + horizontalMargin) + 'px';
      element.style.top = (originalTop + verticalMargin) + 'px';
      element.style.width = width + 'px';
      element.style.height = height + 'px';
      element.style.visibility = '';
    }

    function growWindow(element, onComplete) {
      var pos = element.getBoundingClientRect()
      element.ff7OriginalPos = pos;
      var originalLeft = pos.left;
      var originalTop = pos.top;
      var originalWidth = pos.right - pos.left;
      var originalHeight = pos.bottom - pos.top;
      var scaleFactors = [0.2, 0.5, 0.75, 1];
      var scaleFactorsIndex = 0;
      var timeout = setInterval(function() {
        setWindowSize(element,
          originalLeft,
          originalTop,
          originalWidth,
          originalHeight,
          scaleFactors[scaleFactorsIndex])
        scaleFactorsIndex++;
        if(scaleFactorsIndex === scaleFactors.length) {
          clearTimeout(timeout);
          if(onComplete) {
            onComplete();
          }
        }
      }, ANIMATION_SPEED);
    }

    function shrinkWindow(element, onComplete) {
      var pos = element.ff7OriginalPos;
      var originalLeft = pos.left;
      var originalTop = pos.top;
      var originalWidth = pos.right - pos.left;
      var originalHeight = pos.bottom - pos.top;
      var scaleFactors = [0.2, 0.5, 0.75, 1].reverse();
      var scaleFactorsIndex = 0;
      var timeout = setInterval(function() {
        setWindowSize(element,
          originalLeft,
          originalTop,
          originalWidth,
          originalHeight,
          scaleFactors[scaleFactorsIndex])
        scaleFactorsIndex++;
        if(scaleFactorsIndex === scaleFactors.length) {
          clearTimeout(timeout);
          if(onComplete) {
            onComplete();
          }
        }
      }, ANIMATION_SPEED);
    }

    function createWindowDiv(model) {
      var element = document.createElement('div');
      element.className = 'ff7-window';
      element.id = model.id;
      var positionModel = model.position;
      if(positionModel) {
        if(positionModel.left) {
          element.style.left = positionModel.left + 'px';
        }
        if(positionModel.top) {
          element.style.top = positionModel.top + 'px';
        }
        if(positionModel.width) {
          element.style.width = positionModel.width + 'px';
        }
        if(positionModel.height) {
          element.style.height = positionModel.height + 'px';
        }
      }
      if(model.character) {
        var characterHeader = document.createElement('h1');
        characterHeader.innerHTML = breakLines(model.character);
        element.appendChild(characterHeader);
      }
      if(model.text) {
        var textElement = document.createElement('p');
        textElement.innerHTML = breakLines(model.text);
        element.appendChild(textElement);
      }
      if(model.options) {
        var optionsElement = document.createElement('ul');
        model.options.forEach(function(option) {
          var optionElement = document.createElement('li');
          optionElement.innerHTML = breakLines(option.text || option);
          optionsElement.appendChild(optionElement);
          optionElement.ff7Option = option;
        })
        element.appendChild(optionsElement);
      }
      element.setAttribute('tabindex', 0);
      if(model.className) {
        element.classList.add(model.className);
      }
      return element;
    }

    Dialogue = function(options) {
      this.options = options;
    }

    Dialogue.prototype.show = function() {
      var self = this;
      var model = self.options;
      var element = createWindowDiv(model);
      self.element = element;
      wrapNode(element);
      element.style.visibility = 'hidden';
      document.body.appendChild(element);
      model.element = element;
      growWindow(element, function() {
        animateWindowText(element, function() {
          enableSelections(element, self);
        });
      });
    }

    Dialogue.prototype.hide = function() {
      var self = this;
      FF7.audio.playMenuLeave();
      shrinkWindow(self.element, function() {
        var element = self.element;
        element.style.visibility = 'hidden';
      })
    }

    window.FF7 = {
      Dialogue: Dialogue
    }

  })(window);
