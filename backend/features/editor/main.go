package editor

import (
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

// This struct provides method to interact with journal content data
// (or more correctly: editor functionalities).
//
// Every method in this struct are the public API to provide functionality to the frontend side.
type EditorExport struct{}

// General purpose function to be used across all of editor blocks.

func (*EditorExport) UploadMedia(groupId int, filePath string) (newFileName string, err error) {
	fileName := filepath.Base(filePath)
	savedLocation := filepath.Join(
		internals.DATA_FOLDER_PATH,
		"media",
		utils.ToString(groupId),
		fileName,
	)

	if utils.IsFileExist(savedLocation) {
		return fileName, nil
	}

	err = utils.CopyFile(filePath, savedLocation)
	if err != nil {
		return "", err
	}

	return fileName, nil
}
