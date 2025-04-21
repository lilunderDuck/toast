# app build output directory
OUTPUT_DIR = ./build/out
# app build cache stuff
DIST_DIR = ./build/dist
TOOLS_DIR = ./build/tools

TOOL_SCRIPTS = deno -A npm:esbuild --platform=node --format=esm --bundle --outfile

init:
	${TOOL_SCRIPTS}=./build/dist/mangle_props.js ${TOOLS_DIR}/mangle_props/index.ts

# resource files that the app uses often.
resource_files:
	cd ${TOOLS_DIR} && deno -A fetchPackageJson.ts && go run binary_json.go

# generate execuable icon and stuff
execuable_icon:
	go-winres make

# builds server
build_server:
	go build -o ${OUTPUT_DIR}/server.exe ./backend/main.go

# builds everything
build: execuable_icon build_server
	deno task build
	deno --allow-read --allow-write ./build/dist/mangle_props.js
	del *.syso

dev_server: build_server
	${OUTPUT_DIR}/server.exe

# clean the mess I made
clean:
	del ${OUTPUT_DIR} 
	del ${DIST_DIR}

# in case I did something so horrific that I need to reinstall everything
install:
	deno install
	deno install --allow-scripts=npm:sharp@0.33.5
	go install github.com/tc-hib/go-winres@latest
	go get github.com/akrylysov/pogreb
	go get github.com/fxamacker/cbor/v2
	go get github.com/kardianos/osext
	go get github.com/klauspost/compress
	go get github.com/matoous/go-nanoid/v2
	go get github.com/charmbracelet/log
	go get github.com/gin-gonic/gin
	go get github.com/gin-contrib/cors