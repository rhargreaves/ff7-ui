(function(window) {

	document.addEventListener("DOMContentLoaded", initHandlebars);

	$ = document.querySelector.bind(document);

	function initHandlebars() {

		Handlebars.registerHelper('breaklines', function(text) {
			text = Handlebars.Utils.escapeExpression(text);
			text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
			return new Handlebars.SafeString(text);
		});
	}

	create = function(model) {
		var template = Handlebars.templates['ff7-window.hbs'];
		var html = template(model);
		var element = document.createElement('div');
		element.classList.add('ff7-window');
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
