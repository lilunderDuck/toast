package journal

import (
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*GroupExport) SetExplorerTree(groupId int, data ExplorerData) error {
	return utils.BSON_WriteFile(internals.ExplorerTreeDataSavedPath(groupId), data)
}

func (*GroupExport) GetExplorerTree(groupId int) (*ExplorerData, error) {
	return utils.BSON_ReadFile[ExplorerData](internals.ExplorerTreeDataSavedPath(groupId))
}
