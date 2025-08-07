package journal

import (
	"time"
	"toast/backend/db"
	internal "toast/backend/internals"
	"toast/backend/utils"
)

// The paths where all of the journal groups metadata are being stored,
// which is "~/data/groups"
var GROUP_CACHE_DATA_PATH string = utils.JoinPath(internal.DATA_FOLDER_PATH, "groups")

// Gets the journal group's saved path, which is "~/data/groups/(group id)"
func GetSavedPath(groupId int) string {
	return utils.JoinPath(
		internal.JOURNAL_FOLDER_PATH,
		utils.ToString(groupId),
	)
}

// Save the journal group icon by the given path.
//   - @param data - the journal group data
//   - @param iconPath - the icon path that you want to change. Later, it will be saved at
//     this location: "~/data/journals/[groupId]/icons/(whatever icon filename is)"
func saveAndUpdateIcon(data *JournalGroupData, iconPath string) {
	fileName := utils.GetFileNameWithExtension(iconPath)
	newLocation := utils.JoinPath(GetSavedPath(data.Id), "icons", fileName)
	utils.MoveFile(iconPath, newLocation)
	data.Icon = fileName
}

// Handling journal group metadata updates. This will both update the new data to 2 locations:
//   - Journal groups metadata database: "~/data/groups"
//   - "~/data/journals/(group id)/meta.dat"
//
// ----------------------------------------------------------------------------
//   - @param groupId - the journal group id you want to update.
//   - @param data - the journal group data
func batchUpdate(groupId int, data JournalGroupData) {
	db.OpenThenClose(GROUP_CACHE_DATA_PATH, func(db *db.LevelDb) {
		db.SetObject(groupId, data)
	})

	utils.BSON_WriteFile(utils.JoinPath(GetSavedPath(groupId), "meta.dat"), data)
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
	group.UpdateExplorerTree(groupId, ExplorerTree{})
	utils.BSON_WriteFile(utils.JoinPath(basePath, "setting.dat"), Setting{})
	if options.Icon != "" {
		saveAndUpdateIcon(&data, options.Icon)
	}

	return &data, nil
}

func (*GroupExport) GetAllGroups() []any {
	var data JournalGroupData
	var out []any
	db.OpenThenClose(GROUP_CACHE_DATA_PATH, func(db *db.LevelDb) {
		out = db.GetAllObject(&data)
	})
	return out
}

func (*GroupExport) GetGroup(groupId int) JournalGroupData {
	var data JournalGroupData
	db.OpenThenClose(GROUP_CACHE_DATA_PATH, func(db *db.LevelDb) {
		err := db.GetObject(groupId, &data)
		if err == nil {
			return
		}

		utils.BSON_ReadFile(GetSavedPath(groupId), data)
		db.SetObject(groupId, data)
	})

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
		group.UpdateExplorerTree(groupId, newData.Tree)
	}

	batchUpdate(groupId, oldData)
}

func (*GroupExport) DeleteGroup(groupId int) {
	db.OpenThenClose(GROUP_CACHE_DATA_PATH, func(db *db.LevelDb) {
		db.DeleteObject(groupId)
	})

	utils.RemoveFileOrDirectory(GetSavedPath(groupId))
}
