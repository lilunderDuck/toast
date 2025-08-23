package editor

import (
	"path/filepath"
	"toast/backend/features/journal"
	"toast/backend/utils"
)

func getGallerySavedPath(groupId int, galleryId int) string {
	return utils.JoinPath(journal.GetSavedPath(groupId), "gallery", utils.ToString(galleryId))
}

func getGalleryDataSavedPath(groupId int, galleryId int) string {
	return utils.JoinPath(getGallerySavedPath(groupId, galleryId), "meta.dat")
}

func mergeGalleryData(oldData *GalleryData, newData *GalleryUpdatedData) {
	if newData.Description != "" {
		oldData.Description = newData.Description
	}

	if len(newData.Items) != 0 {
		oldData.Items = newData.Items
	}

	if newData.Name != "" {
		oldData.Name = newData.Name
	}
}

func (*EditorExport) CreateGalleryData(groupId int) *GalleryData {
	galleryId := utils.GetRandomInt()
	basePath := getGallerySavedPath(groupId, galleryId)
	newData := GalleryData{
		Id:    galleryId,
		Items: []GalleryItem{},
	}

	utils.CreateDirectory(basePath)
	utils.BSON_WriteFile(getGalleryDataSavedPath(groupId, galleryId), newData)
	return &newData
}

func (*EditorExport) UpdateGalleryData(groupId, galleryId int, updatedData GalleryUpdatedData) {
	metaFilePath := getGalleryDataSavedPath(groupId, galleryId)
	var oldData GalleryData
	utils.BSON_ReadFile(metaFilePath, &oldData)
	mergeGalleryData(&oldData, &updatedData)
	utils.BSON_WriteFile(metaFilePath, oldData)
}

func (*EditorExport) UploadOneFile(groupId, galleryId int, pathToFile string) (newData *GalleryItem, _ error) {
	basePath := getGallerySavedPath(groupId, galleryId)
	fileName := filepath.Base(pathToFile)
	err := utils.CopyFile(pathToFile, filepath.Join(basePath, fileName))
	if err != nil {
		return nil, err
	}

	fileType, err := determineFileType(pathToFile)
	if err != nil {
		return nil, err
	}

	return &GalleryItem{
		Type:      fileType,
		Name:      filepath.Base(pathToFile),
		AddedDate: 0, // not impl
	}, nil
}

func (*EditorExport) GetGalleryData(groupId, galleryId int) (*GalleryData, error) {
	var oldData GalleryData
	err := utils.BSON_ReadFile(getGalleryDataSavedPath(groupId, galleryId), &oldData)
	if err != nil {
		return nil, err
	}

	return &oldData, nil
}
