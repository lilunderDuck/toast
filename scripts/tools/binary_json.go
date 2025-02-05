package main

import (
	"encoding/json"
	"errors"
	"io/fs"
	"os"
	"server/handler/misc"

	"github.com/fxamacker/cbor/v2"
)

func main() {
	if exists("./out/resource") {
		return
	}

	var (
		splashText misc.SplashTextData
		libUsed    misc.LibraryListData
	)

	readJson("./tools/splash_text.json", &splashText)
	readJson("./tools/lib_used.json", &libUsed)

	bson_writeFile("./out/resource/splashText.bin", &splashText)
	bson_writeFile("./out/resource/libUsed.bin", &libUsed)
}

func exists(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	if errors.Is(err, fs.ErrNotExist) {
		return false
	}
	return false
}

func readJson[T any](filePathToEncode string, out T) {
	dataFromDisk, readError := os.ReadFile(filePathToEncode)
	if readError != nil {
		panic(readError)
	}

	decodeError := json.Unmarshal(dataFromDisk, &out)
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
