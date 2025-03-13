package dynamic

import (
	"burned-toast/backend/utils"
	"fmt"
	"strings"
)

// Generates a new file path with a unique name.
// It appends a random ID to the original file name to avoid conflicts.
//
// Returns the new unique file path.
//
// Parameters:
//   - path: The original file path.
func createNewFilePath(path string) string {
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
