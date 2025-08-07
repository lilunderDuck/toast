// package main

// import (
// 	"encoding/json"
// 	"os"
// 	"toast/backend/utils"
// )

// func main() {
// 	var (
// 		libUsed    misc.LibraryListData
// 		splashText misc.SplashTextData
// 	)

// 	var outDir string = "../out/resource"

// 	readJson("./resouce/lib_used.json", &libUsed)
// 	readJson("./resouce/splash_text.json", &splashText)

// 	os.MkdirAll(outDir, os.ModePerm)

// 	utils.BSON_WriteFile(outDir+"/splashText.bin", &splashText)
// 	utils.BSON_WriteFile(outDir+"/libUsed.bin", &libUsed)
// }

// func readJson[T any](filePathToEncode string, out *T) {
// 	dataFromDisk, readError := os.ReadFile(filePathToEncode)
// 	if readError != nil {
// 		panic(readError)
// 	}

// 	decodeError := json.Unmarshal(dataFromDisk, out)
// 	if decodeError != nil {
// 		panic(decodeError)
// 	}
// }
