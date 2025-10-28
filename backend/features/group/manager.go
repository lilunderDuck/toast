package group

import (
	"os"
	"path/filepath"
	"toast/backend/db"
	"toast/backend/internals"
	"toast/backend/utils"
)

type GroupsManager struct {
	Paths *internals.GroupPathManager
}

// This is a work-around! Simply add a field to GroupsManager could make wails
// binding generation freezes.
func groupDb() *db.DbInstance {
	return db.GetInstance(internals.GROUPS_DATA_PATH)
}

func NewGroupsManager() *GroupsManager {
	return &GroupsManager{
		Paths: internals.NewGroupPathManager(),
	}
}

func (group *GroupsManager) WriteMetadata(groupId string, data *JournalGroupData) error {
	groupDb().SetObject(groupId, data)
	return utils.BSON_WriteFile(group.Paths.MetaFile(groupId), data)
}

func (group *GroupsManager) ReadMetadata(groupId string) (*JournalGroupData, error) {
	println(group.Paths.MetaFile(groupId))
	return utils.BSON_ReadFile[JournalGroupData](group.Paths.MetaFile(groupId))
}

func (group *GroupsManager) Delete(groupId string) {
	os.Remove(group.Paths.Base(groupId))
	groupDb().DeleteObject(groupId)
}

func (group *GroupsManager) SetIcon(data *JournalGroupData, iconPath string) error {
	if err := utils.CopyFile(iconPath, group.Paths.Icon(data.Id)); err != nil {
		return err
	}
	data.Icon = filepath.Base(iconPath)
	return nil
}
