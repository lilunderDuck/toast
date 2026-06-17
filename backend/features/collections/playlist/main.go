package playlist

import (
	"toast/backend/db"
	"toast/backend/utils"
)

type Exports struct {
	database *db.Instance
}

func IsValidStructure(targetPath string) bool {
	hasMetadataFiles :=
		utils.IsFileExist(targetPath+"/entries.json") &&
			utils.IsFileExist(targetPath+"/meta.json")
	isPlaylistFolderStructure :=
		utils.IsDirectoryExist(targetPath+"/icons") &&
			utils.IsDirectoryExist(targetPath+"/tracks")
	return hasMetadataFiles && isPlaylistFolderStructure
}
