package journal

import (
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*GroupExport) SetExplorerTree(groupId int, data ExplorerData) error {
	return utils.BSON_WriteFile(internals.ExplorerTreeDataSavedPath(groupId), data)
}

func (*GroupExport) GetExplorerTree(groupId int) (ExplorerData, error) {
	var data ExplorerData
	err := utils.BSON_ReadFile(internals.ExplorerTreeDataSavedPath(groupId), &data)
	return data, err
}
