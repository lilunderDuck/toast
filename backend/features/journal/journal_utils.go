package journal

import (
	"fmt"
	"os"
	"toast/backend/utils"
)

func journalSavedPath(groupId, journalId int) string {
	return fmt.Sprintf("%s/journals/%d.dat", groupFolderPathOf(groupId), journalId)
}

func writeJournalData(groupId, journalId int, data *JournalData) error {
	return utils.BSON_WriteFile(journalSavedPath(groupId, journalId), data)
}

func readJournalData(groupId, journalId int) (*JournalData, error) {
	return utils.BSON_ReadFile[JournalData](journalSavedPath(groupId, journalId))
}

func deleteJournalData(groupId, journalId int) error {
	return os.Remove(journalSavedPath(groupId, journalId))
}
