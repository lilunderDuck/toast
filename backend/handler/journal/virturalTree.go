package journal

import "burned-toast/backend/utils"

// peak maximum data compression

// Represents a node in a virtual tree structure.
// It has an ID and a list of child nodes.
type VirTreeNode struct {
	Id    int           `form:"id"    json:"id"               cbor:"0,keyasint"`
	Child []VirTreeNode `form:"child" json:"child,omitempty"  cbor:"1,keyasint"`
}

// Representing a list of virtual trees.
type VirTreeData []VirTreeNode

// Get the path of where vtfd.dat is saved, which is:
// ~/data/journal/[groupId]/vtfd.dat
//
// Obscure file name, but it is basically just "virtural tree file display"
// in short-term, that's what "vtfd" stands for.
func getVtfdFilePath(groupId int) string {
	return utils.JoinPath(GetGroupPath(groupId), "vtfd")
}

func CreateVirTree(groupId int) {
	whereToSave := getVtfdFilePath(groupId)
	utils.BSON_WriteFile(whereToSave, VirTreeData{})
}

func SaveVirTree(groupId int, newTree *VirTreeData) error {
	whereToSave := getVtfdFilePath(groupId)
	return utils.BSON_WriteFile(whereToSave, newTree)
}

// Retrieves the virtual tree data for a journal group.
// It retrieves the data from cache.
//
// Returns the virtual tree data.
//
// Parameters:
//   - groupId: The ID of the journal group.
func GetVirTree(groupId int) (*VirTreeData, error) {
	whereToSave := getVtfdFilePath(groupId)
	var out VirTreeData
	err := utils.BSON_ReadFile(whereToSave, &out)
	if err != nil {
		return nil, err
	}

	return &out, nil
}

func DeleteVirTree(groupId int) {
	utils.RemoveFileOrDirectory(getVtfdFilePath(groupId))
}
