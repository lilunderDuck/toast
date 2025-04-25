package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"
)

// Stores the path to the folder where all the journal files are kept,
// which is "~/data/journals"
var journalFolderPath string = utils.JoinPath(internals.DataFolderPath, "journals")

// Gets the path to the folder where a specific journal group's files are saved.
//
// Returns the path to the journal group's saved files folder, which is "~/data/journals/[groupId]/stuff"
//
// Parameters:
//   - groupId: The ID of the journal group.
func GetJournalsSavedFolder(groupId int) string {
	return GetGroupPath(groupId) + "/stuff"
}

// Gets the path to (any) specific journal file
//
// Returns the path to the journal group's folder, which is "~/data/journals/[groupId]/stuff/[journalId].dat"
//
// Parameters:
//   - groupId: The ID of the journal/category/(anything id inside that folder).
func GetJournalSavedFilePath(groupId int, id int) string {
	requestedFile := utils.IntToString(id) + ".dat"
	return utils.JoinPath(GetJournalsSavedFolder(groupId), requestedFile)
}

func GetCategorySavedFilePath(groupId int, id int) string {
	requestedFile := fmt.Sprintf("c%d.dat", id)
	return utils.JoinPath(GetJournalsSavedFolder(groupId), requestedFile)
}

// Gets the path to a specific journal group's folder.
//
// Returns the path to the journal group's folder, which is "~/data/journals/[groupId]/"
//
// Parameters:
//   - groupId: The ID of the journal group.
func GetGroupPath(groupId int) string {
	return utils.JoinPath(journalFolderPath, utils.IntToString(groupId))
}

// Fets the full path to a journal group's metadata file.
//
// Returns the full path to the journal group's metadata file, which is "~/data/journals/[groupId]/meta.dat"
//
// Parameters:
//   - groupId: The ID of the journal group.
func GetGroupMetaFilePath(groupId int) string {
	return utils.JoinPath(GetGroupPath(groupId), "/meta.dat")
}
