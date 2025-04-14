package media

import (
	"burned-toast/backend/utils"
)

func SaveImage(groupId int, filePath string) (string, error) {
	imageFolderPath := GetSavedImageFolderPath(groupId)
	utils.CreateDirectory(imageFolderPath)
	path := utils.JoinPath(imageFolderPath, utils.GetFileNameWithExtension(filePath))
	return SaveAnyImage(filePath, path)
}

func DeleteImage(groupId int, fileName string) {
	imageFolderPath := GetSavedImageFolderPath(groupId)
	utils.RemoveFileOrDirectory(utils.JoinPath(imageFolderPath, fileName))
}

func SaveGalleryImage(groupId int, galleryId int, filePath string) (string, error) {
	galleryFolder := GetSavedGalleryFolderPath(groupId, galleryId)
	utils.CreateDirectory(galleryFolder)
	path := utils.JoinPath(galleryFolder, utils.GetFileNameWithExtension(filePath))
	return SaveAnyImage(filePath, path)
}

func DeleteGalleryImage(groupId int, galleryId int, fileName string) {
	galleryFolder := GetSavedGalleryFolderPath(groupId, galleryId)
	utils.RemoveFileOrDirectory(utils.JoinPath(galleryFolder, fileName))
}
