all: templates

templates: resources/js/templates.js

resources/js/templates.js:
	handlebars resources/templates/*.hbs -f resources/js/templates.js

clean:
	rm resources/js/templates.js
