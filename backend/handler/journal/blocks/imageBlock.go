package blocks

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/utils"
	"fmt"
)

func Image_GetSavedFolderPath(groupId int) string {
	return fmt.Sprintf(
		"%s/image",
		journal.GetJournalsSavedFolder(groupId),
	)
}

func Image_SaveImage(groupId int, fileName string, content []byte) {
	utils.WriteFile(Image_GetSavedFolderPath(groupId)+fileName, content)
}

func Image_DeleteImage(groupId int, fileName string) {
	utils.RemoveFileOrDirectory(Image_GetSavedFolderPath(groupId) + fileName)
}
