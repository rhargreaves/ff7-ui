all: templates

templates: assets/js/templates.js

assets/js/templates.js:
	handlebars resources/templates/*.hbs -f assets/js/templates.js

clean:
	rm assets/js/templates.js
