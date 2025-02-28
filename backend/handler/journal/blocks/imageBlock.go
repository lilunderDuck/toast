package blocks

import (
	"burned-toast/backend/handler/journal/media"
	"burned-toast/backend/utils"
)

func Image_SaveImage(groupId int, fileName string, rawImgStringContent string) string {
	imageFolderPath := GetSavedImageFolderPath(groupId)
	utils.CreateDirectory(imageFolderPath)
	path := utils.JoinPath(imageFolderPath, fileName)
	return media.SaveImage(path, rawImgStringContent)
}

func Image_DeleteImage(groupId int, fileName string) {
	imageFolderPath := GetSavedImageFolderPath(groupId)
	utils.RemoveFileOrDirectory(utils.JoinPath(imageFolderPath, fileName))
}

func Image_SaveGalleryImage(groupId int, galleryId int, fileName string, rawImgStringContent string) string {
	galleryFolder := GetSavedGalleryFolderPath(groupId, galleryId)
	utils.CreateDirectory(galleryFolder)
	path := utils.JoinPath(galleryFolder, fileName)
	return media.SaveImage(path, rawImgStringContent)
}

func Image_DeleteGalleryImage(groupId int, galleryId int, fileName string) {
	galleryFolder := GetSavedGalleryFolderPath(groupId, galleryId)
	utils.RemoveFileOrDirectory(utils.JoinPath(galleryFolder, fileName))
}
