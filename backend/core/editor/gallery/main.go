package gallery

import (
	"path/filepath"
	"toast/backend/features/editor"
	"toast/backend/internals"
	"toast/backend/utils"
)

var writeGallery,
	readGallery,
	uploadToGallery,
	deleteGallery = editor.CreateEmbedableMediaCollection[GalleryData](internals.Media.Get("gallery"))

//

type Exports struct{}

func (*Exports) CreateGallery() *GalleryData {
	data := newGalleryData()
	writeGallery(data.Id, data)
	return data
}

func (editor *Exports) UpdateGallery(galleryId string, updatedData GalleryUpdatedData) {
	data, err := readGallery(galleryId)
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
	writeGallery(galleryId, data)
}

func (*Exports) UploadToGallery(galleryId string, pathToFile string) (*GalleryItem, error) {
	if err := uploadToGallery(galleryId, pathToFile); err != nil {
		return nil, err
	}

	fileType, err := editor.DetermineFileType(pathToFile)
	if err != nil {
		return nil, err
	}

	return &GalleryItem{
		Type:      fileType,
		Name:      filepath.Base(pathToFile),
		AddedDate: utils.GetCurrentDateNow(),
	}, nil
}

func (*Exports) GetGallery(galleryId string) (*GalleryData, error) {
	return readGallery(galleryId)
}

func (*Exports) DeleteGallery(galleryId string) error {
	return deleteGallery(galleryId)
}
