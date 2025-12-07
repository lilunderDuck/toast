package editor

import (
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

type Exports struct{}

// General purpose function to be used across all of editor blocks.

func (*Exports) UploadMedia(groupId string, filePath string) (newFileName string, err error) {
	fileName := filepath.Base(filePath)
	savedLocation := filepath.Join(
		internals.DATA_FOLDER_PATH,
		"media",
		groupId,
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
