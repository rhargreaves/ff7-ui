(function(window) {

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

	function enableSelections(ff7Window) {
		ff7Window.addEventListener('keydown', _.throttle(function(e) {
			var KEY_CODE_UP = 38;
			var KEY_CODE_DOWN = 40;
			var KEY_CODE_ESC = 27;
			var KEY_CODE_ENTER = 13;
			var current = ff7Window.querySelector('li.selected');
			if(!current)
			return;
			if(e.keyCode === KEY_CODE_UP) {
				var prev = current.previousElementSibling || current.parentNode.lastElementChild;
				moveFinger(current, prev);
			} else if(e.keyCode == KEY_CODE_DOWN) {
				var next = current.nextElementSibling || current.parentNode.firstElementChild;
				moveFinger(current, next);
			} else if(e.keyCode == KEY_CODE_ENTER) {

			}
		}, 100, {trailing: false}));
	}

	function moveFinger(currentNode, newNode) {
		currentNode.classList.remove('selected');
		newNode.classList.add('selected');
		ff7.audio.playMenuSelect();
	}

	function animateWindowText(ff7Window, callback) {
		var visibleSpans = ff7Window.querySelectorAll('.text.visible');
		if(visibleSpans.length == 0)
		return;
		var index = 0;
		var charsToWritePerFrame = 1;
		var timeout = setInterval(function() {
			var visibleSpan = visibleSpans[index];
			var invisibleSpan = visibleSpan.nextSibling;
			if(invisibleSpan.textContent.length != visibleSpan.textContent.length) {
				var nextChar = invisibleSpan.textContent.substr(
					visibleSpan.textContent.length, charsToWritePerFrame);
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
			}, 12);
		}

		function growWindow(element, onComplete) {
			var style = getComputedStyle(element);
			var originalWidth = parseInt(style.width);
			var originalHeight = parseInt(style.height);
			var originalMarginLeft = parseInt(style.marginLeft);
			var originalMarginRight = parseInt(style.marginRight);
			var originalMarginTop = parseInt(style.marginTop);
			var originalMarginBottom = parseInt(style.marginBottom);
			var scaleFactors = [0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1];
			var scaleFactorsIndex = 0;
			var timeout = setInterval(function() {
				var width = originalWidth * scaleFactors[scaleFactorsIndex];
				var height = originalHeight * scaleFactors[scaleFactorsIndex];
				var newWidthMargin = (originalWidth - width) / 2;
				var newHeightMargin = (originalHeight - height) / 2;
				element.style.marginLeft = (originalMarginLeft + newWidthMargin) + 'px';
				element.style.marginRight = (originalMarginRight + newWidthMargin) + 'px';
				element.style.marginTop = (originalMarginTop + newHeightMargin) + 'px';
				element.style.marginBottom = (originalMarginBottom + newHeightMargin) + 'px';
				element.style.width = width + 'px';
				element.style.height = height + 'px';
				element.style.visibility = '';
				scaleFactorsIndex++;
				if(scaleFactorsIndex === scaleFactors.length) {
					clearTimeout(timeout);
					element.style.margin = '';
					element.style.width = '';
					element.style.height = '';
					if(onComplete)
					onComplete();
				}
			}, 35);
		}

		function createWindowDiv(model) {
			var element = document.createElement('div');
			element.className = 'ff7-window';
			element.id = model.id;
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
				})
				element.appendChild(optionsElement);
			}
			element.setAttribute('tabindex', 0);
			if(model.className) {
				element.classList.add(model.className);
			}
			return element;
		}

		show = function(model) {
			var element = createWindowDiv(model);
			wrapNode(element);
			element.style.visibility = 'hidden';
			document.body.appendChild(element);
			growWindow(element, function() {
				animateWindowText(element, function() {
					enableSelections(element);
				});
			});

		};

		window.ff7 = {
			show: show
		}

	})(window);
