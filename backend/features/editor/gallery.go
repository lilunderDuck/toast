package editor

import (
	"toast/backend/features/journal"
	"toast/backend/utils"
)

func getGallerySavedPath(groupId int, galleryId int) string {
	return utils.JoinPath(journal.GetSavedPath(groupId), "gallery", utils.ToString(galleryId))
}

func (*EditorExport) CreateGallery(groupId int) *GalleryData {
	galleryId := utils.GetRandomInt()
	basePath := getGallerySavedPath(groupId, galleryId)
	newData := GalleryData{
		Id:    galleryId,
		Items: []GalleryItem{},
	}

	utils.CreateDirectory(basePath)
	utils.BSON_WriteFile(utils.JoinPath(basePath, "meta.dat"), newData)
	return &newData
}

func (*EditorExport) UpdateGallery(groupId int, galleryId int, updatedData GalleryUpdatedData) {
	basePath := getGallerySavedPath(groupId, galleryId)
	var oldData GalleryData
	utils.BSON_ReadFile(utils.JoinPath(basePath, "meta.dat"), &oldData)
	if updatedData.Description != "" {
		oldData.Description = updatedData.Description
	}

	if len(updatedData.Items) != 0 {
		oldData.Items = updatedData.Items
	}

	if updatedData.Name != "" {
		oldData.Name = updatedData.Name
	}

	utils.BSON_WriteFile(utils.JoinPath(basePath, "meta.dat"), oldData)
}

func (*EditorExport) GetGallery(groupId int, galleryId int) (*GalleryData, error) {
	basePath := getGallerySavedPath(groupId, galleryId)

	var oldData GalleryData
	err := utils.BSON_ReadFile(utils.JoinPath(basePath, "meta.dat"), &oldData)
	if err != nil {
		return nil, err
	}

	return &oldData, nil
}
