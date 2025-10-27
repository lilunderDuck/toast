package internals

import (
	"fmt"
)

type GroupPathManager struct {
	basePath string
}

func NewGroupPathManager() *GroupPathManager {
	return &GroupPathManager{
		basePath: fmt.Sprintf("%s/groups/", DATA_FOLDER_PATH),
	}
}

func (path *GroupPathManager) Base(groupId int) string {
	return fmt.Sprintf("%s/%d", path.basePath, groupId)
}

func (path *GroupPathManager) Icon(groupId int) string {
	return fmt.Sprintf("%s/icons", path.Base(groupId))
}

func (path *GroupPathManager) MetaFile(groupId int) string {
	return fmt.Sprintf("%s/meta.dat", path.Base(groupId))
}

func (path *GroupPathManager) Setting(groupId int) string {
	return fmt.Sprintf("%s/setting.dat", path.Base(groupId))
}

func (path *GroupPathManager) JournalContent(groupId int, journalId int) string {
	return fmt.Sprintf("%s/journals/%d.dat", path.Base(groupId), journalId)
}

func (path *GroupPathManager) Media(groupId int, somePath string) string {
	return fmt.Sprintf("%s/%d%s", MEDIA_FOLDER_PATH, groupId, somePath)
}

func (*GroupPathManager) Database() string {
	return fmt.Sprintf("%s/groups", DATA_FOLDER_PATH)
}
