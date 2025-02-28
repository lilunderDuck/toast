package media

import (
	"burned-toast/backend/utils"
	"encoding/json"
	"fmt"
	"log"
	"strings"
)

// Decodes a string encoded image string and saves it to a file.
// If the file already exists, it creates a new file with a unique name.
//
// Returns the name of the saved image file.
//
// Parameters:
//   - path: The desired file path to save the image.
//   - rawImgString: A JSON string containing the string encoded image data.
func SaveImage(path string, rawImgString string) string {
	// this weird code here is from this discussion
	// https://github.com/wailsapp/wails/discussions/773
	// I have no idea why this works.
	fileContent := []byte{}
	if err := json.Unmarshal([]byte(rawImgString), &fileContent); err != nil {
		log.Fatal("panic: ", err)
	}

	fileName := utils.GetFileNameWithExtension(path)
	// makes sure not to overwrite the old file.
	if utils.IsFileExist(path) {
		path = CreateNewFilePath(path)
		fileName = utils.GetFileNameWithExtension(path)
	}

	utils.WriteFile(path, fileContent)
	return fileName
}

// Generates a new file path with a unique name.
// It appends a random ID to the original file name to avoid conflicts.
//
// Returns the new unique file path.
//
// Parameters:
//   - path: The original file path.
func CreateNewFilePath(path string) string {
	fullFileName := utils.GetFileNameWithExtension(path)
	fileDir := utils.GetFileDir(path)
	fileExtension := utils.GetFileExtension(fullFileName)
	fileName := strings.Replace(fullFileName, fileExtension, "", 1)

	randomId, _ := utils.GetRandomIntString()
	fileName = fmt.Sprintf(
		"%s-%s%s",
		fileName,      // original file name
		randomId,      // with a random id
		fileExtension, // close off with the file's original extension
	)

	return utils.JoinPath(fileDir, fileName)
}
