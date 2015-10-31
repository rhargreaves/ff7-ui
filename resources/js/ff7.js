
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

function wrapAllFF7TextNodes() {
	var nodes = document.querySelectorAll('.ff7-window');
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		wrapNode(node);
	}
}

function initPage() {
	animateAllWindows(null, function(ff7Window) {
		enableSelections(ff7Window);
	});
}

function enableSelections(ff7Window) {
	ff7Window.addEventListener('keydown', function() {
		var audio = new Audio('resources/sounds/menu_select.mp3');
		audio.play();
	});
}

function animateAllWindows(onComplete, onWindowComplete) {
	wrapAllFF7TextNodes();
	var windows = document.querySelectorAll('.ff7-window');
	var animationsCompleted = 0;
	for(var i = 0; i<windows.length; i++) {
		var ff7win = windows[i];
		animateWindowText(ff7win, function() {
			onWindowComplete(ff7win);
			animationsCompleted++;
			if(animationsCompleted == windows.length) {
				if(onComplete)
					onComplete();
			}
		});
	}
}

function animateWindowText(window, callback) {
	var visibleSpans = window.querySelectorAll('.text.visible');
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
				var selection = window.querySelector('li.invisible.selected');
				if(selection) {
					selection.classList.remove('invisible');
				}
				callback();
			}
		}
	}, 12);
}
