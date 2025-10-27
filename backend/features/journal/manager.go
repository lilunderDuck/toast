package journal

import (
	"os"
	"toast/backend/internals"
	"toast/backend/utils"
)

type JournalsManager struct {
	Paths *internals.GroupPathManager
}

func NewJournalsManager() *JournalsManager {
	return &JournalsManager{
		Paths: internals.NewGroupPathManager(),
	}
}

func (group *JournalsManager) Write(groupId int, data *JournalData) error {
	return utils.BSON_WriteFile(group.Paths.JournalContent(groupId, data.Id), data)
}

func (group *JournalsManager) Read(groupId, journalId int) (*JournalData, error) {
	return utils.BSON_ReadFile[JournalData](group.Paths.JournalContent(groupId, journalId))
}

func (group *JournalsManager) Delete(groupId, journalId int) {
	os.Remove(group.Paths.JournalContent(groupId, journalId))
}
