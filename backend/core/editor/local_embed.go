package editor

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*Exports) SaveLocalEmbed(pathToHtmlFile string) (string, error) {
	htmlFileName := filepath.Base(pathToHtmlFile)
	folderName := utils.ToString(utils.GetRandomIntWithinLength(16))
	newLocation := filepath.Join(internals.EMBED_SAVED_PATH, folderName)

	// if you select a file inside ~/embed/* path, don't do file copy
	if strings.HasPrefix(pathToHtmlFile, internals.EMBED_SAVED_PATH) {
		return folderName + "/" + htmlFileName, nil
	}

	// else copy everything
	err := os.CopyFS(newLocation, os.DirFS(filepath.Dir(pathToHtmlFile)))

	if err != nil {
		return "", err
	}

	return folderName + "/" + htmlFileName, nil
}

func (*Exports) RenameLocalEmbedFolder(oldFolderName string, newFolderName string) (string, error) {
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
