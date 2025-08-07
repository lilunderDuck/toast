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
	if utils.StringContains(pathToHtmlFile, utils.JoinPath(internal.DATA_FOLDER_PATH, "embed")) {
		return folderName + "/" + htmlFileName, nil
	}

	err := os.CopyFS(
		utils.JoinPath(internal.DATA_FOLDER_PATH, "embed", folderName),
		os.DirFS(basePath),
	)

	if err != nil {
		return "", err
	}

	return folderName + "/" + htmlFileName, nil
}
