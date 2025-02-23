package blocks

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/utils"
	"encoding/json"
	"fmt"
	"log"
)

func Image_GetSavedFolderPath(groupId int) string {
	return fmt.Sprintf(
		"%s/image/",
		journal.GetGroupPath(groupId),
	)
}

func Image_SaveImage(groupId int, fileName string, rawImgStringContent string) (newFileName string) {
	imageFolderPath := Image_GetSavedFolderPath(groupId)
	utils.CreateDirectory(imageFolderPath)
	fileContent := []byte{}
	if err := json.Unmarshal([]byte(rawImgStringContent), &fileContent); err != nil {
		log.Fatal(err)
	}

	randomId, _ := utils.GenerateRandomNumberId()
	utils.WriteFile(Image_GetFullPath(groupId, randomId+fileName), fileContent)
	return randomId + fileName
}

func Image_DeleteImage(groupId int, fileName string) {
	utils.RemoveFileOrDirectory(Image_GetFullPath(groupId, fileName))
}

func Image_GetFullPath(groupId int, fileName string) string {
	return Image_GetSavedFolderPath(groupId) + fileName
}
