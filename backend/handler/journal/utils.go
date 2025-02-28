package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"

	"github.com/akrylysov/pogreb"
)

func CreateGroupFolders(groupId int, groupData *JournalGroupData) (anyError error) {
	groupDirectory := GetGroupPath(groupId)
	utils.CreateDirectory(groupDirectory)
	utils.CreateDirectory(GetJournalsSavedFolder(groupId))

	// write the journal group's metadata
	writeError := UpdateGroupMetaFile(groupData)
	if writeError != nil {
		return writeError
	}

	return nil
}

func UpdateGroupMetaFile(groupData *JournalGroupData) error {
	groupId := utils.IntToString(groupData.Id)
	internals.Cache_Update("journal-group", func(db *pogreb.DB) {
		internals.Cache_Set(db, groupId, groupData)
	})

	return utils.BSON_WriteFile(GetGroupMetaFilePath(groupData.Id), &groupData)
}

func IsGroupExist(groupId int) bool {
	return utils.IsFileExist(GetGroupMetaFilePath(groupId))
}

func Error_GroupNotFound(groupId int) (*JournalGroupData, error) {
	return nil, fmt.Errorf("Group %d not found", groupId)
}
