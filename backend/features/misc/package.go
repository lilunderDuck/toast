package misc

import (
	"toast/backend/internals"
	"toast/backend/utils"
)

var packageListFile = utils.JoinPath(internals.RESOURCE_FOLDER_PATH, "pkl.res")

func (*MiscExport) GetPackageListData() (*PackageMetadata, error) {
	var out PackageMetadata
	err := utils.BSON_ReadFile(packageListFile, &out)
	return &out, err
}
