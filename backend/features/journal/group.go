package journal

import (
	"toast/backend/db"
	"toast/backend/internals"
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
)

// Handling journal group metadata updates. This will both update the new data to 2 locations:
//   - Journal groups metadata database: "~/data/groups"
//   - "~/data/journals/(group id)/meta.dat"
//
// ----------------------------------------------------------------------------
//   - @param groupId - the journal group id you want to update.
//   - @param data - the journal group data
func batchUpdate(groupId int, data *JournalGroupData) {
	db.GetInstance(internals.GROUPS_DATA_DB_PATH).SetObject(groupId, data)
	utils.BSON_WriteFile(internals.JournalGroupMetaSavedPath(groupId), data)
}

func InitGroup() {
	db.Open(internals.GROUPS_DATA_DB_PATH)
}

func (group *GroupExport) CreateGroup(options JournalGroupOptions) (*JournalGroupData, error) {
	groupId := utils.GetRandomInt()
	data := &JournalGroupData{
		Id:          groupId,
		Created:     utils.GetCurrentDateNow(),
		Name:        options.Name,
		Description: options.Description,
	}

	// Make sure to create the directory so we can save our stuff.
	utils.CreateDirectory(internals.GroupIconSavedPath(groupId, ""))
	utils.CreateDirectory(internals.JournalContentSavedPath(groupId))

	batchUpdate(groupId, data)
	group.SetExplorerTree(groupId, ExplorerData{})
	createSettingFile(groupId)

	if options.Icon != "" {
		saveAndUpdateIcon(data, options.Icon)
	}

	return data, nil
}

func (*GroupExport) GetAllGroups() []JournalGroupData {
	var content []JournalGroupData
	db.GetInstance(internals.GROUPS_DATA_DB_PATH).Iterate(func(data []byte) {
		var out JournalGroupData
		err := cbor.Unmarshal(data, &out)
		if err != nil {
			return
		}

		content = append(content, out)
	})

	return content
}

func (*GroupExport) GetGroup(groupId int) JournalGroupData {
	var data JournalGroupData
	dbInstance := db.GetInstance(internals.GROUPS_DATA_DB_PATH)
	err := dbInstance.GetObject(groupId, &data)
	if err != nil {
		utils.BSON_ReadFile(internals.GroupSavedPath(groupId), &data)
		dbInstance.SetObject(groupId, data)
	}

	return data
}

func (group *GroupExport) UpdateGroup(groupId int, newData *JournalGroupOptions) *JournalGroupData {
	oldData := group.GetGroup(groupId)
	if newData.Name != "" {
		oldData.Name = newData.Name
	}

	if newData.Description != "" {
		oldData.Description = newData.Description
	}

	if newData.Icon != "" {
		saveAndUpdateIcon(&oldData, newData.Icon)
	}

	if len(newData.Tree.Tree) != 0 {
		group.SetExplorerTree(groupId, newData.Tree)
	}

	oldData.Modified = utils.GetCurrentDateNow()

	batchUpdate(groupId, &oldData)
	return &oldData
}

func (*GroupExport) DeleteGroup(groupId int) {
	db.GetInstance(internals.GROUPS_DATA_DB_PATH).DeleteObject(groupId)
	utils.RemoveFileOrDirectory(internals.GroupSavedPath(groupId))
}
