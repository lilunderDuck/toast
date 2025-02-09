package journal

import (
	"fmt"
	"server/handler/journal_group"
	"server/utils"
)

func GetJournalsSavedFolder(groupId int) string {
	return journal_group.GetGroupPath(groupId)
}

func GetJournalSavedFilePath(groupId int, journalId int) string {
	return fmt.Sprintf(
		"%s/%s.dat",
		GetJournalsSavedFolder(groupId),
		utils.IntToString(journalId),
	)
}
