package group

import (
	"toast/backend/db"
	"toast/backend/internals"
	"toast/backend/utils"
)

type Exports struct{}

var groupsManager = NewGroupsManager()

func InitGroup() {
	db.Open(internals.GROUPS_DATA_PATH)
}

func (group *Exports) CreateGroup(options JournalGroupOptions) (*JournalGroupData, error) {
	data := newJournalGroup(&options)

	if options.Icon != "" {
		groupsManager.SetIcon(data, options.Icon)
	}

	groupsManager.WriteMetadata(data.Id, data)
	group.SetGroupSetting(data.Id, Setting{})

	return data, nil
}

func (*Exports) GetGroups() []JournalGroupData {
	return db.GetAll[JournalGroupData](internals.GROUPS_DATA_PATH)
}

func (*Exports) GetGroup(groupId string) *JournalGroupData {
	data, _ := groupsManager.ReadMetadata(groupId)
	return data
}

func (group *Exports) UpdateGroup(groupId string, newData *JournalGroupOptions) (*JournalGroupData, error) {
	oldData := group.GetGroup(groupId)
	if newData.Icon != "" {
		groupsManager.SetIcon(oldData, newData.Icon)
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

	groupsManager.WriteMetadata(groupId, oldData)

	return oldData, nil
}

func (*Exports) DeleteGroup(groupId string) {
	groupsManager.Delete(groupId)
}

func (*Exports) SaveMedia(groupId string, from string, to string) {
	utils.CopyFile(from, groupsManager.Paths.Media(groupId, to))
}

func (*Exports) SetGroupSetting(groupId string, newSetting Setting) {
	utils.BSON_WriteFile(groupsManager.Paths.Setting(groupId), newSetting)
}
