BRICKROUGE_JS_COMPRESSED = dist/brickrouge.js
BRICKROUGE_JS_UNCOMPRESSED = dist/brickrouge-uncompressed.js
BRICKROUGE_JS_FILES = \
	lib/core.js \
	lib/utils.js \
	lib/subject.js \
	lib/widget.js

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
