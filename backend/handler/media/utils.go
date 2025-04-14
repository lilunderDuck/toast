package media

import (
	"burned-toast/backend/utils"
	"fmt"
	"strings"
)

// Decodes a string encoded image string and saves it to a file.
// If the file already exists, it creates a new file with a unique name.
//
// Returns the name of the saved image file.
//
// Parameters:
//   - path: The desired file path to save the image.
func SaveAnyImage(fromPath string, toPath string) (string, error) {
	fileName := utils.GetFileNameWithExtension(toPath)
	// makes sure not to overwrite the old file.
	if utils.IsFileExist(toPath) {
		toPath = CreateNewFilePath(toPath)
		fileName = utils.GetFileNameWithExtension(toPath)
	}

	fileContent, err := utils.ReadFile(fromPath)
	if err != nil {
		return "", err
	}

	utils.WriteFile(toPath, fileContent)
	return fileName, nil
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
