package group

import (
	"path/filepath"
	"toast/backend/internals"
)

func GetBasePath() string {
	return filepath.Join(internals.DATA_FOLDER_PATH, "group")
}
