CACHE_BUILD_DIR := ./build/dist
TOOLS_DIR := ./build/tools

# avoid this message
#   mingw32-make: '[something]' is up to date.
.PHONY: build dev clean test

app_resource:
	deno bundle -o ${CACHE_BUILD_DIR}/fetchPackageJson.js ${TOOLS_DIR}/package_used/fetchPackageJson.ts
	go build -o ${CACHE_BUILD_DIR}/generate.exe ${TOOLS_DIR}/package_used/generate.go
	deno --allow-read --allow-write --allow-net ${CACHE_BUILD_DIR}/fetchPackageJson.js
	${CACHE_BUILD_DIR}/generate.exe

# -ldflags="-s -w"
#   -w: omits the DWARF symbol table -> removing debugging information.
#   -s: strips the symbol table and debug information from the binary.
build: app_resource
	wails build -ldflags="-s -w" -skipembedcreate -trimpath

build_debug: app_resource
	wails build -ldflags="-s -w" -skipembedcreate -trimpath -windowsconsole -race

dev:
	wails dev

generate_consts:
	deno -A ./addon/config/consts.ts

# clean the mess I made
clean:
	del ./build/out/bin

test:
	deno test --unstable-sloppy-imports -A --no-check ./build/tools/test/index.ts