BRICKROUGE_JS_COMPRESSED = brickrouge.js
BRICKROUGE_JS_UNCOMPRESSED = brickrouge-uncompressed.js
BRICKROUGE_JS_FILES = \
	lib/core.js \
	lib/utils.js \
	lib/observe.js \
	lib/widget.js

#JS_COMPRESSOR = curl -X POST -s --data-urlencode 'input@$^' http://javascript-minifier.com/raw
#JS_COMPRESSOR = cat $^ # uncomment this line to produce uncompressed files
JS_COMPRESSOR = curl -s \
      -d compilation_level=SIMPLE_OPTIMIZATIONS \
      -d output_format=text \
      -d output_info=compiled_code \
     --data-urlencode "js_code@$^" \
     http://closure-compiler.appspot.com/compile

all: \
	$(BRICKROUGE_JS_UNCOMPRESSED) \
	$(BRICKROUGE_JS_COMPRESSED)

clean:
	rm $(BRICKROUGE_JS_COMPRESSED)
	rm $(BRICKROUGE_JS_UNCOMPRESSED)

$(BRICKROUGE_JS_UNCOMPRESSED): $(BRICKROUGE_JS_FILES)
	cat $^ > $@

$(BRICKROUGE_JS_COMPRESSED): $(BRICKROUGE_JS_UNCOMPRESSED)
	$(JS_COMPRESSOR) > $@
