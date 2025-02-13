cold_start:
	cd ./build/tools/ && go run binary_json.go

dev:
	wails dev

clean:
	del ./frontend/out

BUILD_COMMAND = wails build -platform	windows
prod_build:
	${BUILD_COMMAND}

debug_build:
	${BUILD_COMMAND} --debug