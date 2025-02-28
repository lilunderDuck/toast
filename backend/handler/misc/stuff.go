package misc

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"
)

// Retrieves a random splash text message.
// It reads splash text options from a binary file and avoids repeating the last shown message.
//
// Returns:
//   - A random splash text message.
//   - An error if the splash text file is missing or cannot be read.
func GetRandomSplashText() (randomText string, someError error) {
	path := internals.ResourcesFolderPath + "/splashText.bin"

	var out SplashTextData
	readError := utils.BSON_ReadFile(path, &out)
	if readError != nil {
		return "", internalFileMissingError(path)
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

// Retrieves a list of libraries used by the application.
// It reads the library list from a binary file.
//
// Returns:
//   - A list of libraries used.
//   - An error if the library list file is missing or cannot be read.
func GetLibariesUsedList() (data *LibraryListData, someError error) {
	path := internals.ResourcesFolderPath + "/libUsed.bin"

	var out LibraryListData
	readError := utils.BSON_ReadFile(path, &out)
	if readError != nil {
		return nil, internalFileMissingError(path)
	}

	return &out, nil
}

// Creates an error message indicating a missing internal file.
//
// Parameters:
//   - path: The path to the missing file.
//
// Returns an formatted error indicating the file is missing or corrupted.
func internalFileMissingError(path string) error {
	return fmt.Errorf("[internal file missing] could not read file \"%s\", it might be deleted or corrupted", path)
}
