package journal

import "toast/backend/utils"

func (*GroupExport) UpdateExplorerTree(groupId int, data ExplorerTree) error {
	return utils.BSON_WriteFile(utils.JoinPath(GetSavedPath(groupId), "explorer.dat"), data)
}
