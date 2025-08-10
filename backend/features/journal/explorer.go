package journal

import "toast/backend/utils"

func (*GroupExport) UpdateExplorerTree(groupId int, data ExplorerTree) error {
	return utils.BSON_WriteFile(getExplorerTreeDataSavedPath(groupId), data)
}

func (*GroupExport) GetExplorerTree(groupId int) (ExplorerTree, error) {
	var data ExplorerTree
	err := utils.BSON_ReadFile(getExplorerTreeDataSavedPath(groupId), &data)
	return data, err
}
