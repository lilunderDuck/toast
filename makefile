# avoid this message
#   mingw32-make: '[something]' is up to date.
.PHONY: build dev clean

# -ldflags="-s -w"
#   -w: omits the DWARF symbol table -> removing debugging information.
#   -s: strips the symbol table and debug information from the binary.
build:
	wails build -ldflags="-s -w" -skipembedcreate -trimpath

dev:
	wails dev

# clean the mess I made
clean:
	del ./out/bin