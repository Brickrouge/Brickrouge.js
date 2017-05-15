BRICKROUGE_JS_UMD = dist/brickrouge.umd.js
BRICKROUGE_JS_UMD_MIN = dist/brickrouge.umd.min.js
BRICKROUGE_JS_ES = dist/brickrouge.es2015.js
BRICKROUGE_JS_FILES = $(shell ls src/*.js node_modules/olvlvl-subject/*.js node_modules/olvlvl-mixin/*.js)

JS_COMPRESSOR = `which uglifyjs` $^ \
	--compress \
	--mangle \
	--screw-ie8 \
	--source-map $@.map \
	--source-map-url https://raw.githubusercontent.com/Brickrouge/Brickrouge.js/master/$@.map
#JS_COMPRESSOR = cat $^ # uncomment this line to produce uncompressed files

all: \
	node_modules \
	$(BRICKROUGE_JS_UMD) \
	$(BRICKROUGE_JS_UMD_MIN) \
	$(BRICKROUGE_JS_ES)

node_modules:
	npm install

$(BRICKROUGE_JS_UMD): $(BRICKROUGE_JS_FILES)
	rollup \
	-f umd \
	-i src/Brickrouge.js \
	-o $@ \
	-m $@.map \
	--name Brickrouge

$(BRICKROUGE_JS_ES): $(BRICKROUGE_JS_FILES)
	rollup \
	-f es \
	-i src/Brickrouge.js \
	-o $@ \
	-m $@.map \
	--name Brickrouge

$(BRICKROUGE_JS_UMD_MIN): $(BRICKROUGE_JS_UMD)
	$(JS_COMPRESSOR) > $@

clean:
	rm -Rf node_modules

.PHONY: all clean watch
