package journal

import (
	"fmt"
	"os"
	"path/filepath"
	"toast/backend/db"
	"toast/backend/internals"
	"toast/backend/utils"
)

func groupsDbInstance() *db.DbInstance {
	return db.GetInstance(internals.GROUPS_DATA_PATH)
}

func groupMetaFilePath(groupId int) string {
	return fmt.Sprintf("%s/groups/%d/meta.dat", internals.DATA_FOLDER_PATH, groupId)
}

func groupFolderPathOf(groupId int) string {
	return filepath.Dir(groupMetaFilePath(groupId))
}

func groupIconSavedPath(groupId int, fileName string) string {
	return fmt.Sprintf("%s/icons/%s", groupFolderPathOf(groupId), fileName)
}

func writeGroupData(groupId int, data *JournalGroupData) error {
	groupsDbInstance().SetObject(groupId, data)
	return utils.BSON_WriteFile(
		groupMetaFilePath(groupId),
		data,
	)
}

func readGroupData(groupId int) (*JournalGroupData, error) {
	return utils.BSON_ReadFile[JournalGroupData](
		groupMetaFilePath(groupId),
	)
}

func deleteGroup(groupId int) error {
	return os.Remove(groupFolderPathOf(groupId))
}

func saveAndUpdateGroupIcon(data *JournalGroupData, iconPath string) error {
	fileName := filepath.Base(iconPath)
	if err := utils.MoveFile(iconPath, groupIconSavedPath(data.Id, fileName)); err != nil {
		return err
	}
	data.Icon = fileName
	return nil
}
