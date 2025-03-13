package blocks

import (
	"burned-toast/backend/handler/journal/media"
	"burned-toast/backend/utils"
)

func Media_Save(groupId int, folderPath string, fileName string, rawImgStringContent string) string {
	imagePath := utils.JoinPath(folderPath, fileName)
	utils.CreateDirectory(folderPath)
	return media.SaveImage(imagePath, rawImgStringContent)
}

func Media_Delete(groupId int, folderPath string, fileName string) {
	imagePath := utils.JoinPath(folderPath, fileName)
	utils.RemoveFileOrDirectory(imagePath)
}
