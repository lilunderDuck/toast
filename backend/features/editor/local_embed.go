package editor

import (
	"fmt"
	"os"
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*EditorExport) SaveLocalEmbed(pathToHtmlFile string) (string, error) {
	htmlFileName := filepath.Base(pathToHtmlFile)
	folderName := fmt.Sprintf("%d-%d", utils.GetRandomInt(), utils.GetRandomInt())
	newLocation := filepath.Join(internals.EMBED_SAVED_PATH, folderName)

	// if you select a file inside ~/embed/* path, don't do file copy
	if utils.StringContains(pathToHtmlFile, internals.EMBED_SAVED_PATH) {
		return folderName + "/" + htmlFileName, nil
	}

	// else copy everything
	err := os.CopyFS(newLocation, os.DirFS(filepath.Dir(pathToHtmlFile)))

	if err != nil {
		return "", err
	}

	return folderName + "/" + htmlFileName, nil
}

func (*EditorExport) RenameLocalEmbedFolder(oldFolderName string, newFolderName string) (string, error) {
	oldFolderPath := filepath.Join(internals.EMBED_SAVED_PATH, oldFolderName)
	newFolderPath := filepath.Join(internals.EMBED_SAVED_PATH, newFolderName)

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
