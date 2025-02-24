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

func Image_GetGallerySavedFolderPath(groupId int, galleryId int) string {
	return fmt.Sprintf(
		"%s/gallery/%d/",
		journal.GetGroupPath(groupId),
		galleryId,
	)
}

func saveImage(path string, rawImgString string) {
	fileContent := []byte{}
	if err := json.Unmarshal([]byte(rawImgString), &fileContent); err != nil {
		log.Fatal("panic: ", err)
	}

	utils.WriteFile(path, fileContent)
}

func Image_SaveImage(groupId int, fileName string, rawImgStringContent string) {
	imageFolderPath := Image_GetSavedFolderPath(groupId)
	utils.CreateDirectory(imageFolderPath)
	saveImage(imageFolderPath+fileName, rawImgStringContent)
}

func Image_DeleteImage(groupId int, fileName string) {
	imageFolderPath := Image_GetSavedFolderPath(groupId)
	utils.RemoveFileOrDirectory(imageFolderPath + fileName)
}

func Image_SaveGalleryImage(groupId int, galleryId int, fileName string, rawImgStringContent string) {
	galleryFolder := Image_GetGallerySavedFolderPath(groupId, galleryId)
	utils.CreateDirectory(galleryFolder)
	saveImage(galleryFolder+fileName, rawImgStringContent)
}

func Image_DeleteGalleryImage(groupId int, galleryId int, fileName string) {
	galleryFolder := Image_GetGallerySavedFolderPath(groupId, galleryId)
	utils.RemoveFileOrDirectory(galleryFolder + fileName)
}
