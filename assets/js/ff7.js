(function(window) {

  ANIMATION_SPEED = 25;

  function enableSelections(ff7Window, self) {
    var selection = ff7Window.querySelector('li');
    if(selection) {
      selection.classList.add('selected');
      ff7Window.focus();
    }
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
        if(option.dialog) {
            current.classList.add('flash');
            option.dialog.show(function() {
              current.classList.remove('flash');
              ff7Window.focus();
            });
        } else if(option.action) {
          option.action(function() {
            self.confirm(option);
          });
        } else {
          self.confirm(option);
        }
      } else if(e.keyCode == KEY_CODE_ESC) {
        self.cancel();
      }
    }, 100, {trailing: false}));
  }

  function moveFinger(currentNode, newNode) {
    currentNode.classList.remove('selected');
    newNode.classList.add('selected');
    FF7.audio.playMenuSelect();
  }
    function setWindowSize(element, originalLeft, originalTop,
        originalWidth, originalHeight, scaleFactor, isShrinking) {
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
      if(isShrinking) {
        var contentElement = element.getElementsByTagName("div")[0];
        contentElement.style.marginLeft = ((horizontalMargin) * -1) + 'px';
        contentElement.style.marginTop = ((verticalMargin) * -1) + 'px';
        contentElement.style.marginRight = contentElement.style.marginLeft;
        contentElement.style.marginBottom = contentElement.style.marginTop;
      }
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
          scaleFactors[scaleFactorsIndex],
          false)
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
          scaleFactors[scaleFactorsIndex],
          true)
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
      if(model.style) {
        element.style = model.style;
      }
      var contentElement = document.createElement('div');
      element.appendChild(contentElement);
      if(model.character) {
        var characterHeader = document.createElement('h1');
        characterHeader.innerHTML = FF7.text.breakLines(model.character);
        contentElement.appendChild(characterHeader);
      }
      if(model.text) {
        var textElement = document.createElement('p');
        textElement.innerHTML = FF7.text.breakLines(model.text);
        contentElement.appendChild(textElement);
      }
      if(model.options) {
        var optionsElement = document.createElement('ul');
        model.options.forEach(function(option) {
          var optionElement = document.createElement('li');
          optionElement.innerHTML = FF7.text.breakLines(option.text || option);
          optionsElement.appendChild(optionElement);
          optionElement.ff7Option = option;
        })
        contentElement.appendChild(optionsElement);
      }
      element.setAttribute('tabindex', 0);
      if(model.className) {
        element.classList.add(model.className);
      }
      return element;
    }

    function closeWindow(self) {
      shrinkWindow(self.element, function() {
        var element = self.element;
        element.style.visibility = 'hidden';
      })
    }

    Dialogue = function(options) {
      this.options = options;
    }

    Dialogue.prototype.show = function(onClose) {
      var self = this;
      var model = self.options;
      self.onClose = onClose;
      var element = createWindowDiv(model);
      self.element = element;
      FF7.text.init(element);
      element.style.visibility = 'hidden';
      document.body.appendChild(element);
      model.element = element;
      growWindow(element, function() {
        FF7.text.write(element, function() {
          enableSelections(element, self);
        });
      });
    }

    Dialogue.prototype.confirm = function(option) {
      if(option.sound) {
        FF7.audio.play(option.sound);
      } else {
        FF7.audio.playMenuSelect();
      }
      this.hide();
    }

    Dialogue.prototype.cancel = function() {
      FF7.audio.playMenuLeave();
      this.hide();
    }

    Dialogue.prototype.hide = function() {
      var self = this;
      closeWindow(self);
      if(self.onClose) {
        self.onClose();
      }
    }

    window.FF7 = {
      Dialogue: Dialogue
    }

  })(window);
