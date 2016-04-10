BRICKROUGE_JS_COMPRESSED = dist/brickrouge.js
BRICKROUGE_JS_UNCOMPRESSED = dist/brickrouge-uncompressed.js
BRICKROUGE_JS_FILES = $(shell ls lib/*.js)

JS_COMPRESSOR = curl -s \
	-d compilation_level=SIMPLE_OPTIMIZATIONS \
	-d output_format=text \
	-d output_info=compiled_code \
	-d language=ECMASCRIPT5 \
	--data-urlencode "js_code@$^" \
	http://closure-compiler.appspot.com/compile
#JS_COMPRESSOR = cat $^ # uncomment this line to produce uncompressed files

all: \
	node_modules \
	$(BRICKROUGE_JS_UNCOMPRESSED) \
	$(BRICKROUGE_JS_COMPRESSED)

node_modules:
	npm install

clean:
	rm  -f $(BRICKROUGE_JS_COMPRESSED)
	rm  -f $(BRICKROUGE_JS_UNCOMPRESSED)
	rm -Rf node_modules

watch:
	webpack --progress --colors --watch

$(BRICKROUGE_JS_UNCOMPRESSED): $(BRICKROUGE_JS_FILES)
	webpack

$(BRICKROUGE_JS_COMPRESSED): $(BRICKROUGE_JS_UNCOMPRESSED)
	$(JS_COMPRESSOR) > $@

.PHONY: all clean watch
