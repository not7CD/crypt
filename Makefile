build: node_modules
	node build.js

new: node_modules
	node new-tool.js ${name}

node_modules: package.json
	npm install

.PHONY: build new