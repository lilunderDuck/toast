package editor

import (
	"errors"
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*EditorExport) CreateGalleryData() *GalleryData {
	galleryId := utils.GetRandomIntWithinLength(16)
	basePath := internals.GalleryPath(galleryId)
	updatedData := GalleryData{
		Id:      galleryId,
		Items:   []GalleryItem{},
		Created: utils.GetCurrentDateNow(),
	}

	utils.CreateDirectory(basePath)
	utils.BSON_WriteFile(internals.GalleryDataMetadataPath(galleryId), updatedData)
	return &updatedData
}

func (*EditorExport) UpdateGalleryData(galleryId int, updatedData GalleryUpdatedData) {
	metaFilePath := internals.GalleryDataMetadataPath(galleryId)
	data, err := utils.BSON_ReadFile[GalleryData](metaFilePath)
	if err != nil {
		return
	}

	if updatedData.Description != "" {
		data.Description = updatedData.Description
	}

	if len(updatedData.Items) != 0 {
		data.Items = updatedData.Items
	}

	if updatedData.Name != "" {
		data.Name = updatedData.Name
	}

	data.Modified = utils.GetCurrentDateNow()
	utils.BSON_WriteFile(metaFilePath, data)
}

func (*EditorExport) UploadFileToGallery(galleryId int, pathToFile string) (*GalleryItem, error) {
	if err := uploadFile(internals.GalleryPath(galleryId), pathToFile); err != nil {
		return nil, err
	}

	fileType, err := determineFileType(pathToFile)
	if err != nil {
		return nil, err
	}

	return &GalleryItem{
		Type:      fileType,
		Name:      filepath.Base(pathToFile),
		AddedDate: utils.GetCurrentDateNow(),
	}, nil
}

func (*EditorExport) GetGalleryData(galleryId int) (*GalleryData, error) {
	return utils.BSON_ReadFile[GalleryData](internals.GalleryDataMetadataPath(galleryId))
}

func (editor *EditorExport) DeleteGallery(galleryId int) error {
	data, err := editor.GetGalleryData(galleryId)
	if err != nil {
		return err
	}

	if len(data.Items) != 0 {
		return errors.New("refused to delete, because who knows if you accidentally delete your precious gallery collection?")
	}

	return utils.RemoveFileOrDirectory(internals.GalleryPath(galleryId))
}
