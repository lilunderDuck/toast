package editor_data

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
)

type ImageData struct {
	ImgName     string `json:"imgName,omitempty"       cbor:"10,keyasint,omitempty"`
	Description string `json:"description,omitempty"   cbor:"11,keyasint,omitempty"`
}

func NewImageData(targetFilePath string) *ImageData {
	return &ImageData{
		ImgName: utils.GetFileNameWithExtension(targetFilePath),
	}
}

func GetImageSavedPath(groupId int) string {
	return utils.JoinPath(internals.GetGroupPath(groupId), "image")
}

func (image *ImageData) Save(groupId int, targetFilePath string) error {
	savedPath := GetImageSavedPath(groupId)
	utils.CreateDirectory(savedPath)
	return utils.CopyFile(targetFilePath, utils.JoinPath(savedPath, image.ImgName))
}

func (image *ImageData) Delete(groupId int) error {
	savedPath := GetImageSavedPath(groupId)
	return utils.RemoveFileOrDirectory(utils.JoinPath(savedPath, image.ImgName))
}
