package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"
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
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		cache.Set(groupId, groupData)
	})

	return utils.BSON_WriteFile(GetGroupMetaFilePath(groupData.Id), &groupData)
}

func IsGroupExist(groupId int) bool {
	return utils.IsFileExist(GetGroupMetaFilePath(groupId))
}

func Error_GroupNotFound(groupId int) (*JournalGroupData, error) {
	return nil, fmt.Errorf("Group %d not found", groupId)
}

func mergeGroupData(groupData *JournalGroupData, newData *JournalGroupUpdateSchema) {
	if newData.Name != "" {
		groupData.Name = newData.Name
	}

	if newData.Description != "" {
		groupData.Description = newData.Description
	}

	if len(newData.Tree) != 0 {
		groupData.Tree = newData.Tree
	}
}

func mergeJournalData(currentJournalData *JournalData, newData *JournalUpdateSchema) {
	if newData.Name != "" {
		currentJournalData.Name = newData.Name
	}

	if len(newData.Data) != 0 {
		currentJournalData.Data = newData.Data
	}

	currentJournalData.Modified = utils.GetCurrentDateNow()
}
