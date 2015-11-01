
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
	ff7Window.addEventListener('keydown', function(e) {
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
		}
	});
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
	var timeout = setInterval(function() {
		var visibleSpan = visibleSpans[index];
		var invisibleSpan = visibleSpan.nextSibling;
		if(invisibleSpan.textContent.length != 0) {
			var nextChar = invisibleSpan.textContent.substring(0, 1);
			visibleSpan.textContent += nextChar;
			invisibleSpan.textContent = invisibleSpan.textContent.substring(1, invisibleSpan.textContent.length);
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
