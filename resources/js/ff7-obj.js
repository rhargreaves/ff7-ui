(function(window) {

	create = function(model) {
		var template = Handlebars.templates['ff7-window.hbs'];
		var html = template(model);
		var element = document.createElement('div');
		element.className = 'ff7-window';
		element.setAttribute('tabindex', 0);
		if(model.className)
			element.classList.add(model.className);
		element.innerHTML = html;
		wrapNode(element);
		document.body.appendChild(element);
		animateWindowText(element, function() {
			enableSelections(element);
		});
	};

	window.ff7 = {
		create: create
	}

})(window);
