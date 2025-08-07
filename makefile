# avoid this message
#   mingw32-make: '[something]' is up to date.
.PHONY: build dev clean

# builds everything
build: build_server
	wails build

dev:
	wails dev

# clean the mess I made
clean:
	del ${OUTPUT_DIR} 
	del ${DIST_DIR}