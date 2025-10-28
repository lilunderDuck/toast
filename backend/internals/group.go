package internals

import (
	"fmt"
)

type GroupPathManager struct {
	basePath string
}

func NewGroupPathManager() *GroupPathManager {
	return &GroupPathManager{
		basePath: fmt.Sprintf("%s/groups", DATA_FOLDER_PATH),
	}
}

func (path *GroupPathManager) Base(groupId string) string {
	return fmt.Sprintf("%s/%s", path.basePath, groupId)
}

func (path *GroupPathManager) Icon(groupId string) string {
	return fmt.Sprintf("%s/icons", path.Base(groupId))
}

func (path *GroupPathManager) MetaFile(groupId string) string {
	return fmt.Sprintf("%s/meta.dat", path.Base(groupId))
}

func (path *GroupPathManager) Setting(groupId string) string {
	return fmt.Sprintf("%s/setting.dat", path.Base(groupId))
}

func (path *GroupPathManager) JournalContent(groupId string, journalId string) string {
	return fmt.Sprintf("%s/journals/%s.dat", path.Base(groupId), journalId)
}

func (path *GroupPathManager) Media(groupId string, somePath string) string {
	return fmt.Sprintf("%s/%s%s", MEDIA_FOLDER_PATH, groupId, somePath)
}

func (*GroupPathManager) Database() string {
	return fmt.Sprintf("%s/groups", DATA_FOLDER_PATH)
}
