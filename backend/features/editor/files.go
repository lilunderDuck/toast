package editor

import (
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*EditorExport) UploadFile(groupId int, filePath string, newLocation string) (newFileName string, err error) {
	fileName := filepath.Base(filePath)
	savedLocation := filepath.Join(
		internals.GroupSavedPath(groupId),
		newLocation,
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
