VITE_APP_COMMAND = deno run -A npm:vite --config ./vite.config.ts

BUILD_SCRIPTS_COMMAND = deno run -A npm:esbuild --bundle --format=esm --platform=node --outdir=./out --external:esbuild

START_SERVER = ./out/server/main
SERVER_ENTRY_POINT = main.go
SERVER_BUILD_OUTPUT = ../out/server/main.exe

install_packages:
	deno install
	cd server && go get

cold_start:
	cd server && go run ./tools/binary_json.go	

build_hacky:
	${BUILD_SCRIPTS_COMMAND} ./scripts/additional-tasks.ts

build_server:
	cd server && go build -ldflags "-X main.mode=release -H windowsgui" -o ${SERVER_BUILD_OUTPUT} ${SERVER_ENTRY_POINT}

build_app:
	${VITE_APP_COMMAND} build

dev_server:
	cd server && go build -o ${SERVER_BUILD_OUTPUT} ${SERVER_ENTRY_POINT}
	${START_SERVER}

dev_app:
	${VITE_APP_COMMAND}

preview:
	${START_SERVER}