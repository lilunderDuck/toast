package journal_group

import (
	"fmt"
	"server/server"
	"server/utils"

	"github.com/akrylysov/pogreb"
)

func CreateGroupFolders(groupId int, groupData *Data) (anyError error) {
	groupDirectory := GetGroupPath(groupId)
	createDirError := utils.CreateDirectory(groupDirectory)
	if createDirError != nil {
		return createDirError
	}

	// write the journal group's metadata
	writeError := UpdateGroupMetaFile(groupData)
	if writeError != nil {
		return writeError
	}

	return nil
}

func GetGroupPath(groupId int) string {
	return server.JournalFolderPath + "/" + utils.IntToString(groupId)
}

func GetGroupMetaFilePath(groupId int) string {
	return GetGroupPath(groupId) + "/meta.dat"
}

func UpdateGroupMetaFile(groupData *Data) error {
	groupId := utils.IntToString(groupData.Id)
	server.Cache_Update("journal-group", func(db *pogreb.DB) {
		server.Cache_Set(db, groupId, groupData)
	})

	return utils.BSON_WriteFile(GetGroupMetaFilePath(groupData.Id), &groupData)
}

func IsGroupExist(groupId int) bool {
	return utils.IsFileExist(GetGroupMetaFilePath(groupId))
}

func GroupNotFoundError(groupId int) (*Data, error) {
	return nil, fmt.Errorf("Group %d not found", groupId)
}
