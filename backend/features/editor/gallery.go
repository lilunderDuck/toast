package editor

import (
	"fmt"
	"os"
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

func galleryMetaPath(galleryId int) string {
	return fmt.Sprintf(`%s/gallery/%d/meta.dat`, internals.DATA_FOLDER_PATH, galleryId)
}

func galleryPath(galleryId int) string {
	return fmt.Sprintf(`%s/gallery/%d`, internals.DATA_FOLDER_PATH, galleryId)
}

func (*EditorExport) CreateGalleryData() *GalleryData {
	galleryId := utils.GetRandomIntWithinLength(16)
	updatedData := GalleryData{
		Id:      galleryId,
		Items:   []GalleryItem{},
		Created: utils.GetCurrentDateNow(),
	}

	utils.BSON_WriteFile(galleryMetaPath(galleryId), updatedData)
	return &updatedData
}

func (editor *EditorExport) UpdateGalleryData(galleryId int, updatedData GalleryUpdatedData) {
	metaFilePath := galleryMetaPath(galleryId)
	data, err := editor.GetGalleryData(galleryId)
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
	if err := uploadFile(galleryPath(galleryId), pathToFile); err != nil {
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
	return utils.BSON_ReadFile[GalleryData](galleryMetaPath(galleryId))
}

func (editor *EditorExport) DeleteGallery(galleryId int) error {
	return os.Remove(galleryPath(galleryId))
}
