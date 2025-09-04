package editor

import (
	"fmt"
	"os"
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

func (*EditorExport) RenameFolderName(folderName, oldFolderName, newFolderName string) (string, error) {
	basePath := determineModifiableFolderLocation(folderName)

	oldFolderPath := filepath.Join(basePath, oldFolderName)
	newFolderPath := filepath.Join(basePath, newFolderName)

	if utils.IsDirectoryExist(newFolderPath) {
		newFolderPath = filepath.Join(
			internals.EMBED_SAVED_PATH,
			fmt.Sprintf("%s_%d", newFolderName, utils.GetRandomInt()),
		)
	}

	err := os.Rename(oldFolderPath, newFolderPath)
	if err != nil {
		return "", err
	}

	return newFolderPath, err
}

func (*EditorExport) UploadMedia(groupId int, filePath string) (newFileName string, err error) {
	fileName := filepath.Base(filePath)
	savedLocation := filepath.Join(
		internals.MediaPath(groupId),
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
