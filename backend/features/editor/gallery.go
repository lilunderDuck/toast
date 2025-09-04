package editor

import (
	"errors"
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

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

	oldData.Modified = utils.GetCurrentDateNow()
}

func (*EditorExport) CreateGalleryData() *GalleryData {
	galleryId := utils.GetRandomIntWithinLength(16)
	basePath := internals.GalleryPath(galleryId)
	newData := GalleryData{
		Id:      galleryId,
		Items:   []GalleryItem{},
		Created: utils.GetCurrentDateNow(),
	}

	utils.CreateDirectory(basePath)
	utils.BSON_WriteFile(internals.GalleryDataFilePath(galleryId), newData)
	return &newData
}

func (*EditorExport) UpdateGalleryData(galleryId int, updatedData GalleryUpdatedData) {
	metaFilePath := internals.GalleryDataFilePath(galleryId)
	var data GalleryData
	utils.BSON_ReadFile(metaFilePath, &data)
	mergeGalleryData(&data, &updatedData)
	utils.BSON_WriteFile(metaFilePath, data)
}

func (*EditorExport) UploadOneFile(galleryId int, pathToFile string) (newData *GalleryItem, _ error) {
	basePath := internals.GalleryPath(galleryId)
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
		AddedDate: utils.GetCurrentDateNow(),
	}, nil
}

func (*EditorExport) GetGalleryData(galleryId int) (*GalleryData, error) {
	var data GalleryData
	err := utils.BSON_ReadFile(internals.GalleryDataFilePath(galleryId), &data)
	if err != nil {
		return nil, err
	}

	return &data, nil
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
