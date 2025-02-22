package journal

import (
	"burned-toast/backend/handler/journal_group"
	"burned-toast/backend/utils"
	"fmt"
)

// Get the journal saved folder path.
//
// The full file path is “
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
