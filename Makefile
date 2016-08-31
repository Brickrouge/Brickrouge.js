BRICKROUGE_JS_UNCOMPRESSED = dist/brickrouge.js
BRICKROUGE_JS_COMPRESSED = dist/brickrouge.min.js
BRICKROUGE_JS_FILES = $(shell ls src/*.js node_modules/olvlvl-subject/*.js node_modules/olvlvl-mixin/*.js)

JS_COMPRESSOR = `which uglifyjs` $^ \
	--compress \
	--mangle \
	--screw-ie8 \
	--source-map $@.map \
	--source-map-url https://github.com/Brickrouge/Brickrouge.js/tree/master/$@.map
#JS_COMPRESSOR = cat $^ # uncomment this line to produce uncompressed files

all: \
	node_modules \
	$(BRICKROUGE_JS_UNCOMPRESSED) \
	$(BRICKROUGE_JS_COMPRESSED)

node_modules:
	npm install

$(BRICKROUGE_JS_UNCOMPRESSED): $(BRICKROUGE_JS_FILES)
	rollup \
	-f iife \
	-i src/Brickrouge.js \
	-o $@ \
	-m $@.map \
	--name Brickrouge

$(BRICKROUGE_JS_COMPRESSED): $(BRICKROUGE_JS_UNCOMPRESSED)
	$(JS_COMPRESSOR) > $@

clean:
	rm  -f $(BRICKROUGE_JS_COMPRESSED)
	rm  -f $(BRICKROUGE_JS_UNCOMPRESSED)
	rm -Rf node_modules

watch:
	webpack --progress --colors --watch

.PHONY: all clean watch
