package playlist

import (
	"toast/backend/features/collections/common"
	"toast/backend/utils"
)

const (
	VALIDATION_ERR_METADATA             = 0
	VALIDATION_ERR_MISSING_ICONS_FOLDER = 1
)

func (playlist *Exports) Playlist_ensureValidStructure(targetPath string) *common.ValidationResult {
	_, err := utils.ReadJsonFile[PlaylistData](targetPath + "/meta.json")
	if err != nil {
		return common.NewValidationResult(VALIDATION_ERR_METADATA, "Your playlist is missing the metadata.json file, or the content inside it is malformed.")
	}

	if !utils.IsDirectoryExist(targetPath + "/icons") {
		return common.NewValidationResult(VALIDATION_ERR_MISSING_ICONS_FOLDER, "Your playlist is missing the \"icon\" folder.")
	}

	if !utils.IsDirectoryExist(targetPath + "/tracks") {
		return common.NewValidationResult(VALIDATION_ERR_MISSING_ICONS_FOLDER, "Your playlist is missing the \"tracks\" folder.")
	}

	return nil
}
