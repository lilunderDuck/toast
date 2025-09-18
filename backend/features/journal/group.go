package journal

import (
	"path/filepath"
	"toast/backend/db"
	"toast/backend/internals"
	"toast/backend/utils"
)

func InitGroup() {
	db.Open(internals.GROUPS_DATA_PATH)
}

func (group *GroupExport) CreateGroup(options JournalGroupOptions) (*JournalGroupData, error) {
	groupId := utils.GetRandomInt()
	data := &JournalGroupData{
		Id:          groupId,
		Created:     utils.GetCurrentDateNow(),
		Name:        options.Name,
		Description: options.Description,
		Explorer:    ExplorerData{},
	}

	group.SetSetting(groupId, &Setting{})

	if options.Icon != "" {
		saveAndUpdateGroupIcon(data, options.Icon)
	}

	writeGroupData(groupId, data)

	return data, nil
}

func (*GroupExport) GetAllGroups() []JournalGroupData {
	return db.GetAll[JournalGroupData](internals.GROUPS_DATA_PATH)
}

func (*GroupExport) GetGroup(groupId int) *JournalGroupData {
	data, _ := readGroupData(groupId)
	return data
}

func (group *GroupExport) UpdateGroup(groupId int, newData *JournalGroupOptions) (*JournalGroupData, error) {
	oldData := group.GetGroup(groupId)
	if newData.Icon != "" {
		fileName := filepath.Base(newData.Icon)
		err := utils.MoveFile(newData.Icon, groupIconSavedPath(groupId, fileName))
		if err != nil {
			return nil, err
		}
		oldData.Icon = fileName
	}

	if newData.Name != "" {
		oldData.Name = newData.Name
	}

	if newData.Description != "" {
		oldData.Description = newData.Description
	}

	if len(newData.Tree.Tree) != 0 {
		oldData.Explorer = newData.Tree
	}

	oldData.Modified = utils.GetCurrentDateNow()

	writeGroupData(groupId, oldData)

	return oldData, nil
}

func (*GroupExport) DeleteGroup(groupId int) {
	groupsDbInstance().DeleteObject(groupId)
	deleteGroup(groupId)
}
