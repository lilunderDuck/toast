package main

import (
	"burned-toast/backend/handler/misc"
	"encoding/json"
	"fmt"
	"os"

	"github.com/fxamacker/cbor/v2"
	"github.com/klauspost/compress/zstd"
)

func main() {
	var (
		libUsed    misc.LibraryListData
		splashText misc.SplashTextData
	)

	var outDir string = "../bin/resource"

	readJson("./lib_used.json", &libUsed)
	readJson("./splash_text.json", &splashText)

	os.MkdirAll(outDir, os.ModePerm)

	bson_writeFile(outDir+"/splashText.bin", &splashText)
	bson_writeFile(outDir+"/libUsed.bin", &libUsed)
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

var encoder, _ = zstd.NewWriter(nil)

func bson_writeFile(path string, anyObject any) error {
	binaryData, encodeError := cbor.Marshal(anyObject)
	if encodeError != nil {
		fmt.Println("BSON encode error ->", encodeError)
		return encodeError
	}

	binaryData = encoder.EncodeAll(binaryData, make([]byte, 0, len(binaryData)))

	writeError := os.WriteFile(path, binaryData, os.ModePerm)
	if writeError != nil {
		return writeError
	}

	return nil
}
