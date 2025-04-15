OUTPUT_DIR = ./build/out
TOOLS_DIR = ./build/tools

cold_start:
	cd ${TOOLS_DIR} && deno -A fetchPackageJson.ts && go run binary_json.go

build_server:
	go build -o ${OUTPUT_DIR}/server.exe ./backend/main.go

build: build_server
	deno task build

dev_server: build_server
	${OUTPUT_DIR}/server.exe

clean:
	del ${OUTPUT_DIR}

# in case I did something so horrific that I need to reinstall everything
install:
	deno install
	deno install --allow-scripts=npm:sharp@0.33.5
	go get github.com/akrylysov/pogreb
	go get github.com/fxamacker/cbor/v2
	go get github.com/kardianos/osext
	go get github.com/klauspost/compress
	go get github.com/matoous/go-nanoid/v2
	go get github.com/charmbracelet/log
	go get github.com/gin-gonic/gin
	go get github.com/gin-contrib/cors