package internals

import (
	"path/filepath"
	"toast/backend/utils"
)

// The path where all of journal groups data are stored, which is "~/groups".
var GROUP_FOLDER_PATH string = filepath.Join(CURRENT_EXECUTABLE_PATH, "groups")

var GROUPS_DATA_DB_PATH string = filepath.Join(CACHE_FOLDER_PATH, "groups")

// Gets the journal group's saved path, which is "~/groups/(group id)"
func GroupSavedPath(groupId int) string {
	return filepath.Join(GROUP_FOLDER_PATH, utils.ToString(groupId))
}

func GroupIconSavedPath(groupId int, fileName string) string {
	return filepath.Join(GroupSavedPath(groupId), "icons", fileName)
}

// Gets the file path where the journal group's explorer tree data is stored,
// which is "~/groups/(group id)/explorer.dat".
//
// Because you can reorder any journal and folder, it isn't simple as your good ol'
// file system. It must be stored so that the app knows how to display them.
func ExplorerTreeDataSavedPath(groupId int) string {
	return filepath.Join(GroupSavedPath(groupId), "explorer.dat")
}

func JournalGroupMetaSavedPath(groupId int) string {
	return filepath.Join(GroupSavedPath(groupId), "meta.dat")
}

func SettingFileSavedPath(groupId int) string {
	return filepath.Join(GroupSavedPath(groupId), "setting.dat")
}

// Gets the folder path where all of the journals content should be stored,
// which is "~/groups/(group id)/journals"
//
// Not to be confused with [getJournalContentSavedFilePath()], that function
// gets the *file* path, this one gets the *folder* path.
func JournalContentSavedPath(groupId int) string {
	return filepath.Join(
		GROUP_FOLDER_PATH,
		utils.ToString(groupId),
		"journals",
	)
}

// Gets the file path where all of the journals content should be stored
// Which is "~/groups/(group id)/journals/(journal id).dat"
//
// Not to be confused with [getJournalContentSavedPath()], that function
// gets the *folder* path, this one gets the *file* path.
func JournalContentSavedFilePath(groupId, journalId int) string {
	return filepath.Join(
		JournalContentSavedPath(groupId),
		utils.ToString(journalId)+".dat",
	)
}
