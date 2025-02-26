cold_start:
	cd ./build/tools/ && deno -A fetchPackageJson.ts && go run binary_json.go

dev:
	wails dev

clean:
	del ./frontend/out

BUILD_COMMAND = wails build
prod_build:
	${BUILD_COMMAND}

debug_build:
	${BUILD_COMMAND} --debug