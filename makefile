VITE_APP_COMMAND = deno run -A npm:vite --config ./vite-app.config.ts
VITE_SERVER_COMMAND = deno run -A npm:vite --config ./vite-server.config.ts

BUILD_SCRIPTS_COMMAND = deno run -A npm:esbuild --bundle --format=esm --platform=node --outdir=./out --external:esbuild

START_SERVER = ./out/server/main

cold_start:
	go run ./scripts/tools/binary_json.go	

build_hacky:
	${BUILD_SCRIPTS_COMMAND} ./scripts/additional-tasks.ts

build_server:
	go build -ldflags "-X main.mode=release -H windowsgui" -o out/server/main.exe main.go

build_app:
	${VITE_APP_COMMAND} build

dev_server:
	go build -o ./out/server/main.exe main.go
	${START_SERVER}

dev_app:
	${VITE_APP_COMMAND}

preview:
	${START_SERVER}