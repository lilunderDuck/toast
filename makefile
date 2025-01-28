VITE_APP_COMMAND = deno run -A npm:vite --config ./vite-app.config.ts
VITE_SERVER_COMMAND = deno run -A npm:vite --config ./vite-server.config.ts
BUILD_SCRIPTS_COMMAND = deno run -A npm:esbuild --bundle --format=esm --platform=node --outdir=./out --external:esbuild
RUN_SERVER = deno -A ./out/server/entry-server.mjs
COMMAND_AFTER_RUN_SERVER = deno -A ./out/additional-tasks.js

build_hacky:
	${BUILD_SCRIPTS_COMMAND} ./scripts/additional-tasks.ts

build_server:
	${VITE_SERVER_COMMAND} build --mode=NOT-development
	${COMMAND_AFTER_RUN_SERVER}
	deno compile --output="./out/burned toast" --allow-read --allow-write --allow-net --node-modules-dir="none" ./out/server/entry-server.mjs

build_app:
	${VITE_APP_COMMAND} build

dev_server:
	${VITE_SERVER_COMMAND} build --mode=development
	${COMMAND_AFTER_RUN_SERVER}
	${RUN_SERVER}

dev_app:
	${VITE_APP_COMMAND}

build: build_app build_server
preview:
	${RUN_SERVER}