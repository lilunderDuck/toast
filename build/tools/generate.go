package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"toast/backend/features/misc"
	"toast/backend/utils"
)

func main() {
	var outDir string = "../out/bin/resource"
	currentExe, _ := os.Executable()
	currentExe = filepath.Dir(currentExe)
	os.MkdirAll(filepath.Join(currentExe, outDir), os.ModePerm)

	var libUsed []misc.PackageContentData
	readJson(filepath.Join(currentExe, "lib_used.json"), &libUsed)
	utils.BSON_WriteFile(filepath.Join(currentExe, outDir, "pkl.res"), libUsed)
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
