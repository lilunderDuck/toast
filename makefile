# avoid this message
#   mingw32-make: '[something]' is up to date.
.PHONY: build dev clean

app_resource:
	deno bundle -o ./build/dist/fetchPackageJson.js ./build/tools/fetchPackageJson.ts
	go build -o ./build/dist/generate.exe ./build/tools/generate.go
	deno --allow-read --allow-write --allow-net ./build/dist/fetchPackageJson.js
	./build/dist/generate.exe

# -ldflags="-s -w"
#   -w: omits the DWARF symbol table -> removing debugging information.
#   -s: strips the symbol table and debug information from the binary.
build: app_resource
	wails build -ldflags="-s -w" -skipembedcreate -trimpath

build_debug: app_resource
	wails build -ldflags="-s -w" -skipembedcreate -trimpath -windowsconsole -race

dev: app_resource
	wails dev

# clean the mess I made
clean:
	del ./build/out/bin