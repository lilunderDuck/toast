package editor

import (
	"os"
	"strings"
	internal "toast/backend/internals"
	"toast/backend/utils"
)

func (*EditorExport) SaveLocalEmbed(pathToHtmlFile string) (string, error) {
	basePath := utils.GetFileDir(pathToHtmlFile)
	htmlFileName := utils.GetFileNameWithExtension(pathToHtmlFile)
	folderName := strings.Split(basePath, "/")[len(basePath)-1]
	if utils.StringContains(pathToHtmlFile, internal.EMBED_SAVED_PATH) {
		return folderName + "/" + htmlFileName, nil
	}

	err := os.CopyFS(
		utils.JoinPath(internal.EMBED_SAVED_PATH, folderName),
		os.DirFS(basePath),
	)

	if err != nil {
		return "", err
	}

	return folderName + "/" + htmlFileName, nil
}
