package journal

import "toast/backend/utils"

func (*GroupExport) SetExplorerTree(groupId int, data ExplorerData) error {
	return utils.BSON_WriteFile(getExplorerTreeDataSavedPath(groupId), data)
}

func (*GroupExport) GetExplorerTree(groupId int) (ExplorerData, error) {
	var data ExplorerData
	err := utils.BSON_ReadFile(getExplorerTreeDataSavedPath(groupId), &data)
	return data, err
}
