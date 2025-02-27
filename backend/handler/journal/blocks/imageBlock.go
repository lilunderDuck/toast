package blocks

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/utils"
	"encoding/json"
	"fmt"
	"log"
	"path/filepath"
	"strings"
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

func saveImage(path string, rawImgString string) string {
	fileContent := []byte{}
	if err := json.Unmarshal([]byte(rawImgString), &fileContent); err != nil {
		log.Fatal("panic: ", err)
	}

	fileName := getFileName(path)
	if utils.IsFileExist(path) {
		path = createNewFilePath(path)
		fileName = getFileName(path)
	}

	utils.WriteFile(path, fileContent)
	return fileName
}

func getFileName(path string) string {
	return filepath.Base(path)
}

func createNewFilePath(path string) string {
	fullFileName := getFileName(path)
	fileDir := filepath.Dir(path)
	fileExtension := filepath.Ext(fullFileName)
	fileName := strings.Replace(fullFileName, fileExtension, "", 1)

	randomId, _ := utils.GetRandomIntString()
	return filepath.Join(
		fileDir,
		fmt.Sprintf(
			"%s-%s%s",
			fileName,
			randomId,
			fileExtension,
		),
	)
}

func Image_SaveImage(groupId int, fileName string, rawImgStringContent string) string {
	imageFolderPath := Image_GetSavedFolderPath(groupId)
	utils.CreateDirectory(imageFolderPath)
	path := imageFolderPath + fileName
	return saveImage(path, rawImgStringContent)
}

func Image_DeleteImage(groupId int, fileName string) {
	imageFolderPath := Image_GetSavedFolderPath(groupId)
	utils.RemoveFileOrDirectory(imageFolderPath + fileName)
}

func Image_SaveGalleryImage(groupId int, galleryId int, fileName string, rawImgStringContent string) string {
	galleryFolder := Image_GetGallerySavedFolderPath(groupId, galleryId)
	utils.CreateDirectory(galleryFolder)
	path := galleryFolder + fileName
	return saveImage(path, rawImgStringContent)
}

func Image_DeleteGalleryImage(groupId int, galleryId int, fileName string) {
	galleryFolder := Image_GetGallerySavedFolderPath(groupId, galleryId)
	utils.RemoveFileOrDirectory(galleryFolder + fileName)
}
