package main

import (
	"burned-toast/backend/handler/misc"
	"encoding/json"
	"os"

	"github.com/fxamacker/cbor/v2"
)

func main() {
	var (
		libUsed    misc.LibraryListData
		splashText misc.SplashTextData
	)

	readJson("./tools/lib_used.json", &libUsed)
	readJson("./tools/splash_text.json", &splashText)

	os.MkdirAll("../out/server/resource", os.ModePerm)

	bson_writeFile("../out/server/resource/splashText.bin", &splashText)
	bson_writeFile("../out/server/resource/libUsed.bin", &libUsed)
}

func readJson[T any](filePathToEncode string, out *T) {
	dataFromDisk, readError := os.ReadFile(filePathToEncode)
	if readError != nil {
		panic(readError)
	}

	decodeError := json.Unmarshal(dataFromDisk, out)
	if decodeError != nil {
		panic(decodeError)
	}
}

func bson_writeFile(path string, anyObject any) error {
	binaryData, encodeError := cbor.Marshal(anyObject)
	if encodeError != nil {
		return encodeError
	}

	writeError := os.WriteFile(path, binaryData, 0666)
	if writeError != nil {
		return writeError
	}

	return nil
}
