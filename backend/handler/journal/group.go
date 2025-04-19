package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"
	"os"
	"time"
)

// Defines the structure for creating a new journal group.
type JournalGroupSchema struct {
	Name        string `form:"name"        json:"name"                   binding:"required"`
	Description string `form:"description" json:"description,omitempty"`
	Icon        string `form:"icon"        json:"icon,omitempty"`
}

// Defines the structure for updating an existing journal group.
type JournalGroupUpdateSchema struct {
	Name        string `form:"name"        json:"name,omitempty"`
	Description string `form:"description" json:"description,omitempty"`
	Icon        string `form:"icon"        json:"icon,omitempty"`
}

// Represents the complete data for a journal group
type JournalGroupData struct {
	Id          int           `json:"id"                    cbor:"0,keyasint"`
	Created     time.Duration `json:"created"               cbor:"1,keyasint"`
	Modified    time.Duration `json:"modified,omitempty"    cbor:"2,keyasint,omitempty"`
	Name        string        `json:"name"                  cbor:"3,keyasint"`
	Description string        `json:"description,omitempty" cbor:"4,keyasint,omitempty"`
	HasIcon     bool          `json:"hasIcon"               cbor:"5,keyasint"`
}

// Creates a new journal group.
// It generates a unique ID, creates the group data, saves it to cache, and creates the group's folder.
//
// Parameters:
//   - groupSchema: The data for the new journal group.
//
// Returns:
//   - *JournalGroupData: The created journal group data.
//   - error: An error if creation fails.
func CreateGroup(groupSchema *JournalGroupSchema) (newGroupData *JournalGroupData, anyError error) {
	stringRandomId, numberId := utils.GenerateRandomNumberId()

	// Create new journal group data
	data := JournalGroupData{
		Name:        groupSchema.Name,
		Description: groupSchema.Description,
		Id:          numberId,
		Created:     utils.GetCurrentDateNow(),
		HasIcon:     groupSchema.Icon != "",
	}

	// Save it to cache so we can access it later
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		cache.Set(stringRandomId, &data)
	})

	// Create the journal group data folder to save your stuffs
	someError := createGroupFolders(numberId, &data)
	if someError != nil {
		return nil, someError
	}

	return &data, nil
}

func createGroupFolders(groupId int, groupData *JournalGroupData) (anyError error) {
	groupDirectory := GetGroupPath(groupId)
	utils.CreateDirectory(groupDirectory)
	utils.CreateDirectory(GetJournalsSavedFolder(groupId))
	CreateVirTree(groupId)

	// write the journal group's metadata
	writeError := updateGroupMetaFile(groupData)
	if writeError != nil {
		return writeError
	}

	return nil
}

// Retrieves a journal group by its ID.
// It first tries to get the data from cache, and if not found, reads it from the meta file.
//
// Parameters:
//   - groupId: The ID of the journal group.
//
// Returns:
//   - *JournalGroupData: The journal group data.
//   - error: An error if the group is not found or reading fails.
func GetGroup(groupId int) (*JournalGroupData, error) {
	if !isGroupExist(groupId) {
		return nil, fmt.Errorf("group %d not found", groupId)
	}

	var outData JournalGroupData
	err := utils.BSON_ReadFile(GetGroupMetaFilePath(groupId), &outData)
	if err != nil {
		return nil, err
	}

	return &outData, nil
}

func isGroupExist(groupId int) bool {
	return utils.IsFileExist(GetGroupMetaFilePath(groupId))
}

// Updates an existing journal group.
// It retrieves the current data, merges the new data, updates the cache, and updates the meta file.
//
// Parameters:
//   - groupId: The ID of the journal group to update.
//   - newData: The new data to update the group with.
//
// Returns:
//   - *JournalGroupData: The updated journal group data.
//   - error: An error if the update fails.
func UpdateGroup(
	groupId int,
	newData *JournalGroupUpdateSchema,
) (updatedGroupData *JournalGroupData, anyError error) {
	// Gets the previous data that has been saved
	groupData, someError := GetGroup(groupId)
	if someError != nil {
		return nil, someError
	}

	mergeGroupData(groupId, groupData, newData)

	// Make sure to update the meta data and cache data too.
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		cache.Set(utils.IntToString(groupData.Id), &groupData)
	})

	updateGroupMetaFile(groupData)

	return groupData, nil
}

func updateGroupMetaFile(groupData *JournalGroupData) error {
	groupId := utils.IntToString(groupData.Id)
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		cache.Set(groupId, groupData)
	})

	return utils.BSON_WriteFile(GetGroupMetaFilePath(groupData.Id), &groupData)
}

func mergeGroupData(groupId int, groupData *JournalGroupData, newData *JournalGroupUpdateSchema) {
	if newData.Name != "" {
		groupData.Name = newData.Name
	}

	if newData.Description != "" {
		groupData.Description = newData.Description
	}

	if newData.Icon != "" {
		groupData.HasIcon = true
		utils.CopyFile(newData.Icon, utils.JoinPath(GetGroupPath(groupId), "icon.png"))
	}
}

// Deletes a journal group by its ID.
// It removes the group from cache and deletes the group's folder.
//
// Returns an error if the deletion fails.
//
// Parameters:
//   - groupId: The ID of the journal group to delete.
func DeleteGroup(groupId int) error {
	// Deletes from cache first
	groupDataPath := GetGroupPath(groupId)
	var err error
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		err = cache.Delete(utils.IntToString(groupId))
	})

	if err != nil {
		fmt.Println(err)
		return err
	}

	// Then everything on that group's folder data...
	err = os.RemoveAll(groupDataPath)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

// Retrieves all journal groups from cache.
//
// Returns an array containing all journal group data.
func GetAllGroup() []any {
	var out []any
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		out = cache.GetAllValue()
	})
	return out
}
