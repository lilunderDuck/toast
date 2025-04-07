cold_start:
	cd ./build/tools/ && deno -A fetchPackageJson.ts && go run binary_json.go

dev_server:
	go build -o ./build/server.exe ./backend/main.go
	./build/server.exe

clean:
	del ./frontend/out

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