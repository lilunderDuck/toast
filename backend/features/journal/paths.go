package journal

import (
	"toast/backend/internals"
	"toast/backend/utils"
)

// The paths where all of the journal groups metadata are being stored,
// which is "~/data/groups"
var GROUP_CACHE_DATA_PATH string = utils.JoinPath(internals.DATA_FOLDER_PATH, "groups")

// Gets the journal group's saved path, which is "~/data/groups/(group id)"
func GetSavedPath(groupId int) string {
	return utils.JoinPath(
		internals.JOURNAL_FOLDER_PATH,
		utils.ToString(groupId),
	)
}

// Gets the file where the journal group's explorer tree data is stored,
// which is "~/data/journals/(group id)/explorer.dat".
//
// Because you can reorder any journal and folder, it isn't simple as your good ol'
// file system. It must be stored so that the app knows how to display them.
func getExplorerTreeDataSavedPath(groupId int) string {
	return utils.JoinPath(GetSavedPath(groupId), "explorer.dat")
}

func getJournalGroupMetaSavedPath(groupId int) string {
	return utils.JoinPath(GetSavedPath(groupId), "meta.dat")
}

// Gets the folder path where all of the journals metadata are being stored.
// Which is "~/data/journals/(group id)/.journal"
func getJournalsDatabasePath(groupId int) string {
	return utils.JoinPath(internals.JOURNAL_FOLDER_PATH, utils.ToString(groupId), ".journal")
}

// Gets the folder path where all of the journals content should be stored,
// which is "~/data/journals/(group id)/stuff"
//
// Not to be confused with [getJournalContentSavedFilePath()], that function
// gets the *file* path, this one gets the *folder* path.
func getJournalContentSavedPath(groupId int) string {
	return utils.JoinPath(internals.JOURNAL_FOLDER_PATH, utils.ToString(groupId), "stuff")
}

// Gets the file path where all of the journals content should be stored
// Which is "~/data/journals/(group id)/stuff/(journal id).dat"
//
// Not to be confused with [getJournalContentSavedPath()], that function
// gets the *folder* path, this one gets the *file* path.
func getJournalContentSavedFilePath(groupId, journalId int) string {
	return utils.JoinPath(getJournalContentSavedPath(groupId), utils.ToString(journalId)+".dat")
}

// Save the journal group icon by the given path.
//   - @param data - the journal group data
//   - @param iconPath - the icon path that you want to change. Later, it will be saved at
//     this location: "~/data/journals/[groupId]/icons/(whatever icon filename is)"
func saveAndUpdateIcon(data *JournalGroupData, iconPath string) {
	fileName := utils.GetFileNameWithExtension(iconPath)
	newLocation := utils.JoinPath(GetSavedPath(data.Id), "icons", fileName)
	utils.MoveFile(iconPath, newLocation)
	data.Icon = fileName
}
