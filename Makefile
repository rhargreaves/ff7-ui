all: build

build: npm assets/js/underscore.min.js

npm:
	npm install

assets/js/underscore.min.js:
	ln ./node_modules/underscore/underscore-min.js assets/js/underscore.min.js

clean:
	rm assets/js/templates.js
