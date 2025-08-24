package journal

import (
	"time"
	"toast/backend/db"
	"toast/backend/utils"
)

// Handling journal group metadata updates. This will both update the new data to 2 locations:
//   - Journal groups metadata database: "~/data/groups"
//   - "~/data/journals/(group id)/meta.dat"
//
// ----------------------------------------------------------------------------
//   - @param groupId - the journal group id you want to update.
//   - @param data - the journal group data
func batchUpdate(groupId int, data JournalGroupData) {
	db.GetInstance(GROUP_CACHE_DATA_PATH).SetObject(groupId, data)
	utils.BSON_WriteFile(getJournalGroupMetaSavedPath(groupId), data)
}

func InitGroup() {
	db.Open(GROUP_CACHE_DATA_PATH)
}

func (group *GroupExport) CreateGroup(options JournalGroupOptions) (*JournalGroupData, error) {
	groupId := utils.GetRandomInt()
	basePath := GetSavedPath(groupId)
	data := JournalGroupData{
		Id:          groupId,
		Created:     time.Duration(time.Now().Nanosecond()),
		Name:        options.Name,
		Description: options.Description,
	}

	// Make sure to create the directory so we can save our stuff.
	utils.CreateDirectory(utils.JoinPath(basePath, "icons"))
	utils.CreateDirectory(getJournalContentSavedPath(groupId))

	batchUpdate(groupId, data)
	group.SetExplorerTree(groupId, ExplorerTree{})
	createSettingFile(groupId)

	if options.Icon != "" {
		saveAndUpdateIcon(&data, options.Icon)
	}

	return &data, nil
}

func (*GroupExport) GetAllGroups() []any {
	var data JournalGroupData
	return db.GetInstance(GROUP_CACHE_DATA_PATH).GetAllObject(&data)
}

func (*GroupExport) GetGroup(groupId int) JournalGroupData {
	var data JournalGroupData
	dbInstance := db.GetInstance(GROUP_CACHE_DATA_PATH)
	err := dbInstance.GetObject(groupId, &data)
	if err != nil {
		utils.BSON_ReadFile(GetSavedPath(groupId), &data)
		dbInstance.SetObject(groupId, data)
	}

	return data
}

func (group *GroupExport) UpdateGroup(groupId int, newData *JournalGroupOptions) {
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

	if len(newData.Tree) != 0 {
		group.SetExplorerTree(groupId, newData.Tree)
	}

	batchUpdate(groupId, oldData)
}

func (*GroupExport) DeleteGroup(groupId int) {
	db.GetInstance(GROUP_CACHE_DATA_PATH).DeleteObject(groupId)
	utils.RemoveFileOrDirectory(GetSavedPath(groupId))
}
