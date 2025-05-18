package editor_data

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"strings"
)

type GalleryData struct {
	GalleryId string `json:"galleryId,omitempty"     cbor:"50,keyasint,omitempty"`
}

type GalleryItemCacheData struct {
	Name string `json:"name"`
	Type int8   `json:"type"`
	Id   int    `json:"id,omitempty"`
}

func (gallery *GalleryData) GetSavedPath(groupId int) string {
	return utils.JoinPath(
		internals.GetGroupPath(groupId),
		"gallery",
		gallery.GalleryId,
	)
}

func (gallery *GalleryData) Save(
	currentGroupId int,
	filePath string,
	fileMineType string,
) (*GalleryItemCacheData, error) {
	var fileType int8
	switch strings.Split(fileMineType, "/")[0] {
	case "image":
		fileType = 1
	case "video":
		fileType = 2
	default:
		fileType = 0 // not supported
	}

	fileName := utils.GetFileNameWithExtension(filePath)
	newData := &GalleryItemCacheData{
		Name: fileName,
		Type: fileType,
	}

	internals.OpenDb(gallery.GalleryId, func(thisCache *internals.JSONCacheUtils) {
		thisCache.Set(fileName, newData)
	})

	return newData, nil
}

func (gallery *GalleryData) Delete(fileName string) {
	internals.OpenDb(gallery.GalleryId, func(thisCache *internals.JSONCacheUtils) {
		thisCache.Delete(fileName)
	})
}

func (gallery *GalleryData) GetAll() ([]any, error) {
	var galleryItems []any // []GalleryItemCacheData
	internals.OpenDb(gallery.GalleryId, func(thisCache *internals.JSONCacheUtils) {
		galleryItems = thisCache.GetAllValue()
	})

	return galleryItems, nil
}

func (gallery *GalleryData) Recorver() {
	// empty
}
