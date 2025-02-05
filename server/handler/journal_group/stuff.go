package journal_group

import (
	"os"
	"server/server"
	"server/utils"
)

func Create(groupSchema *Schema) (newGroupData *Data, anyError error) {
	stringRandomId, numberId := utils.GenerateRandomNumberId()

	// Create new journal group data
	data := Data{
		Name:        groupSchema.Name,
		Description: groupSchema.Description,
		Id:          numberId,
		Created:     utils.GetCurrentDateNow(),
		Tree:        VirTree_Create(),
	}

	// Save it to cache so we can access it later
	server.Cache_Set(server.JournalGroupDb, stringRandomId, &data)

	// Create the journal group data folder to save your stuffs
	someError := CreateGroupFolders(numberId, &data)
	if someError != nil {
		return nil, someError
	}

	return &data, nil
}

func Get(groupId int) (*Data, error) {
	if !IsGroupExist(groupId) {
		return GroupNotFoundError(groupId)
	}

	// This is just to convert string id to number id
	thisGroupId := utils.IntToString(groupId)

	// Try to get journal group data from cache.
	var dataFromCache Data
	anyError := server.Cache_Get(server.JournalGroupDb, thisGroupId, &dataFromCache)
	// If success, returns it.
	if anyError == nil {
		return &dataFromCache, nil
	}

	// If for some reason it could not get the data from cache,
	// it will try to read the meta.dat file...
	metaFilePath := GetGroupMetaFilePath(groupId)

	var outData Data
	writeError := utils.BSON_ReadFile(metaFilePath, &outData)
	// ...and if could not find it, well, this might be being corrupted or deleted.
	if writeError != nil {
		return nil, writeError
	}

	// Also make sure to save it to the cache as well.
	server.Cache_Set(server.JournalGroupDb, thisGroupId, &outData)

	return &outData, nil
}

func Update(groupId int, newData *UpdateSchema) (updatedGroupData *Data, anyError error) {
	// Gets the previous data that has been saved
	groupData, someError := Get(groupId)
	if someError != nil {
		return nil, someError
	}

	// This is a work-around to "merge" the previous data with the new one.
	// We uses "groupData" to update directly, instead of using another variable.
	if newData.Name != "" {
		groupData.Name = newData.Name
	}

	if newData.Description != "" {
		groupData.Description = newData.Description
	}

	if len(newData.Tree) != 0 {
		groupData.Tree.Data = newData.Tree
	}

	if newData.Item != 0 {
		groupData.Tree.List = append(groupData.Tree.List, newData.Item)
	}

	// Make sure to update the meta data and cache data too.
	server.Cache_Set(server.JournalGroupDb, utils.IntToString(groupId), &groupData)
	UpdateGroupMetaFile(groupData)

	return groupData, nil
}

func Delete(groupId int) error {
	// Firstly, it will delete from cache first
	groupDataPath := GetGroupPath(groupId)
	updateError := server.Cache_Delete(server.JournalGroupDb, utils.IntToString(groupId))
	if updateError != nil {
		println(updateError.Error())
		return updateError
	}

	// Then, everything on that group's folder data...
	removeError := os.RemoveAll(groupDataPath)
	if removeError != nil {
		println(removeError.Error())
		return removeError
	}

	return nil // ...and we're done
}

func GetAll() []any {
	return server.Cache_GetAllValue(server.JournalGroupDb)
}
