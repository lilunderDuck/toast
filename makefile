CACHE_BUILD_DIR := ./build/dist
TOOLS_DIR := ./build/tools

APP_TAGS_DEBUG = -tags=TOAST_DEBUG
# -ldflags="..."
#   -w: omits the DWARF symbol table -> removing debugging information.
#   -s: strips the symbol table and debug information from the binary.
#   -buildid: remove go build id embeded into the binary, looks something like this
#     Go build id: "... long id string ..."
#     see: https://github.com/golang/go/issues/34186
APP_PROD_BUILD_FLAGS = -ldflags="-s -w -buildid=" -skipembedcreate -trimpath

# avoid this message
#   mingw32-make: '[something]' is up to date.
.PHONY: build dev clean test

app_resource:
	deno bundle -o ${CACHE_BUILD_DIR}/fetchPackageJson.js ${TOOLS_DIR}/package_used/fetchPackageJson.ts
	go build -o ${CACHE_BUILD_DIR}/generate.exe ${TOOLS_DIR}/package_used/generate.go
	deno --allow-read --allow-write --allow-net ${CACHE_BUILD_DIR}/fetchPackageJson.js
	${CACHE_BUILD_DIR}/generate.exe

build: app_resource
	wails build ${APP_PROD_BUILD_FLAGS}

build_debug: app_resource
	wails build ${APP_PROD_BUILD_FLAGS} -windowsconsole -race -devtools

dev:
	wails dev ${APP_TAGS_DEBUG}

generate_consts:
	deno -A ./addon/config/consts.ts

# clean the mess I made
clean:
	del ./build/out/bin

test:
	deno test --unstable-sloppy-imports -A --no-check ./build/tools/test/index.ts