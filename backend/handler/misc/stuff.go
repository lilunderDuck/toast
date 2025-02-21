package misc

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"
)

func GetRandomSplashText() (randomText string, someError error) {
	path := internals.ResourcesFolderPath + "/splashText.bin"

	var out SplashTextData
	readError := utils.BSON_ReadFile(path, &out)
	if readError != nil {
		return "", formatError(path)
	}

	var lastSplashText string
	rawByteData, readError := utils.ReadFile(internals.CacheFolderPath + "/stuff.txt")
	if readError != nil {
		lastSplashText = ""
	} else {
		lastSplashText = utils.BytesToString(rawByteData)
	}

	var randomSplashText string
	for { // while true
		randomSplashText = utils.GetRandomElementFromArray(out)
		if randomSplashText != lastSplashText {
			utils.WriteFile(internals.CacheFolderPath+"/stuff.txt", []byte(randomSplashText))
			break
		}

		// keep rollin'
	}

	return randomSplashText, nil
}

func GetLibariesUsedList() (data *LibraryListData, someError error) {
	path := internals.ResourcesFolderPath + "/libUsed.bin"

	var out LibraryListData
	readError := utils.BSON_ReadFile(path, &out)
	if readError != nil {
		return nil, formatError(path)
	}

	return &out, nil
}

func formatError(path string) error {
	return fmt.Errorf("[internal file missing] could not read file \"%s\", it might be deleted or corrupted", path)
}
