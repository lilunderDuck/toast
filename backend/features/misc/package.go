package misc

import (
	"toast/backend/internals"
	"toast/backend/utils"
)

var packageListFile = utils.JoinPath(internals.RESOURCE_FOLDER_PATH, "pkl.res")

func (*MiscExport) GetPackageListData() ([]PackageContentData, error) {
	var out []PackageContentData
	err := utils.BSON_ReadFile(packageListFile, &out)
	return out, err
}
