package editor

import (
	"os"
	"path/filepath"
	"strings"
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*EditorExport) SaveLocalEmbed(pathToHtmlFile string) (string, error) {
	basePath := filepath.Dir(pathToHtmlFile)
	htmlFileName := filepath.Base(pathToHtmlFile)
	folderName := strings.Split(basePath, "/")[len(basePath)-1]
	if utils.StringContains(pathToHtmlFile, internals.EMBED_SAVED_PATH) {
		return folderName + "/" + htmlFileName, nil
	}

	err := os.CopyFS(
		filepath.Join(internals.EMBED_SAVED_PATH, folderName),
		os.DirFS(basePath),
	)

	if err != nil {
		return "", err
	}

	return folderName + "/" + htmlFileName, nil
}
