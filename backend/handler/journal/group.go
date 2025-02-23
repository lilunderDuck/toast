package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"os"
	"time"

	"github.com/akrylysov/pogreb"
)

type JournalGroupSchema struct {
	Name        string `form:"name"        json:"name"      binding:"required"`
	Description string `form:"description" json:"description,omitempty"`
}

type JournalGroupUpdateSchema struct {
	Name        string      `form:"name"        json:"name,omitempty"`
	Description string      `form:"description" json:"description,omitempty"`
	Tree        VirTreeList `form:"tree"        json:"tree,omitempty"`
	Item        int         `form:"item"        json:"item,omitempty"`
}

type JournalGroupData struct {
	Id          int           `json:"id"                    cbor:"0,keyasint"`
	Created     time.Duration `json:"created"               cbor:"1,keyasint"`
	Modified    time.Duration `json:"modified,omitempty"    cbor:"2,keyasint,omitempty"`
	Name        string        `json:"name"                  cbor:"3,keyasint"`
	Description string        `json:"description,omitempty" cbor:"4,keyasint,omitempty"`
	Tree        VirTreeData   `json:"tree"                  cbor:"5,keyasint,toarray"`
}

func Group_Create(groupSchema *JournalGroupSchema) (newGroupData *JournalGroupData, anyError error) {
	stringRandomId, numberId := utils.GenerateRandomNumberId()

	// Create new journal group data
	data := JournalGroupData{
		Name:        groupSchema.Name,
		Description: groupSchema.Description,
		Id:          numberId,
		Created:     utils.GetCurrentDateNow(),
		Tree:        VirTree_Create(),
	}

	// Save it to cache so we can access it later
	internals.Cache_Update("journal-group", func(db *pogreb.DB) {
		internals.Cache_Set(db, stringRandomId, &data)
	})

	// Create the journal group data folder to save your stuffs
	someError := CreateGroupFolders(numberId, &data)
	if someError != nil {
		return nil, someError
	}

	return &data, nil
}

func Group_Get(groupId int) (*JournalGroupData, error) {
	if !IsGroupExist(groupId) {
		return GroupNotFoundError(groupId)
	}

	// This is just to convert string id to number id
	thisGroupId := utils.IntToString(groupId)

	// Try to get journal group data from cache.
	var dataFromCache JournalGroupData
	var cacheError error
	internals.Cache_Update("journal-group", func(db *pogreb.DB) {
		cacheError = internals.Cache_Get(db, thisGroupId, &dataFromCache)
	})

	// If success, returns it.
	if cacheError == nil {
		return &dataFromCache, nil
	}

	// If for some reason it could not get the data from cache,
	// it will try to read the meta.dat file...
	metaFilePath := GetGroupMetaFilePath(groupId)

	var outData JournalGroupData
	writeError := utils.BSON_ReadFile(metaFilePath, &outData)
	// ...and if could not find it, well, this might be being corrupted or deleted.
	if writeError != nil {
		return nil, writeError
	}

	// Also make sure to save it to the cache as well.
	internals.Cache_Update("journal-group", func(db *pogreb.DB) {
		internals.Cache_Set(db, thisGroupId, &outData)
	})

	return &outData, nil
}

func Group_GetVirTreeData(groupId int) map[string]any {
	var outData map[string]any
	internals.Cache_Update(utils.IntToString(groupId), func(db *pogreb.DB) {
		outData = internals.Cache_GetAll(db)
	})

	return outData
}

func Group_Update(groupId int, newData *JournalGroupUpdateSchema) (updatedGroupData *JournalGroupData, anyError error) {
	// Gets the previous data that has been saved
	groupData, someError := Group_Get(groupId)
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
	internals.Cache_Update("journal-group", func(db *pogreb.DB) {
		internals.Cache_Set(db, utils.IntToString(groupData.Id), &groupData)
	})
	UpdateGroupMetaFile(groupData)

	return groupData, nil
}

func Group_Delete(groupId int) error {
	// Firstly, it will delete from cache first
	groupDataPath := GetGroupPath(groupId)
	var updateError error
	internals.Cache_Update("journal-group", func(db *pogreb.DB) {
		updateError = internals.Cache_Delete(db, utils.IntToString(groupId))
	})
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

func Group_GetAll() []any {
	var out []any
	internals.Cache_Update("journal-group", func(db *pogreb.DB) {
		out = internals.Cache_GetAllValue(db)
	})
	return out
}
