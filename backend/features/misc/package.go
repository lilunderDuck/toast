package misc

import (
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

var packageListFile = filepath.Join(internals.RESOURCE_FOLDER_PATH, "pkl.res")

func (*Exports) GetPackageListData() (*[]PackageContentData, error) {
	return utils.BSON_ReadFile[[]PackageContentData](packageListFile)
}
