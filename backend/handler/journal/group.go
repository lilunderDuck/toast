package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"os"
	"time"
)

// Defines the structure for creating a new journal group.
type JournalGroupSchema struct {
	Name        string `form:"name"        json:"name"      binding:"required"`
	Description string `form:"description" json:"description,omitempty"`
}

// Defines the structure for updating an existing journal group.
type JournalGroupUpdateSchema struct {
	Name        string      `form:"name"        json:"name,omitempty"`
	Description string      `form:"description" json:"description,omitempty"`
	Tree        VirTreeData `form:"tree"        json:"tree,omitempty"`
}

// Represents the complete data for a journal group
type JournalGroupData struct {
	Id          int           `json:"id"                    cbor:"0,keyasint"`
	Created     time.Duration `json:"created"               cbor:"1,keyasint"`
	Modified    time.Duration `json:"modified,omitempty"    cbor:"2,keyasint,omitempty"`
	Name        string        `json:"name"                  cbor:"3,keyasint"`
	Description string        `json:"description,omitempty" cbor:"4,keyasint,omitempty"`
	Tree        VirTreeData   `json:"tree"                  cbor:"5,keyasint,toarray"`
}

type JournalGroupUtils struct{}

// Creates a new journal group.
// It generates a unique ID, creates the group data, saves it to cache, and creates the group's folder.
//
// Parameters:
//   - groupSchema: The data for the new journal group.
//
// Returns:
//   - *JournalGroupData: The created journal group data.
//   - error: An error if creation fails.
func (group *JournalGroupUtils) CreateGroup(groupSchema *JournalGroupSchema) (newGroupData *JournalGroupData, anyError error) {
	stringRandomId, numberId := utils.GenerateRandomNumberId()

	// Create new journal group data
	data := JournalGroupData{
		Name:        groupSchema.Name,
		Description: groupSchema.Description,
		Id:          numberId,
		Created:     utils.GetCurrentDateNow(),
		Tree:        []VirTreeNode{},
	}

	// Save it to cache so we can access it later
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		cache.Set(stringRandomId, &data)
	})

	// Create the journal group data folder to save your stuffs
	someError := CreateGroupFolders(numberId, &data)
	if someError != nil {
		return nil, someError
	}

	return &data, nil
}

// Group_Get retrieves a journal group by its ID.
// It first tries to get the data from cache, and if not found, reads it from the meta file.
//
// Parameters:
//   - groupId: The ID of the journal group.
//
// Returns:
//   - *JournalGroupData: The journal group data.
//   - error: An error if the group is not found or reading fails.
func (group *JournalGroupUtils) GetGroup(groupId int) (*JournalGroupData, error) {
	if !IsGroupExist(groupId) {
		return Error_GroupNotFound(groupId)
	}

	var outData JournalGroupData
	utils.BSON_ReadFile(GetGroupMetaFilePath(groupId), &outData)

	return &outData, nil
}

// Retrieves the virtual tree data for a journal group.
// It retrieves the data from cache.
//
// Returns the virtual tree data.
//
// Parameters:
//   - groupId: The ID of the journal group.
func (group *JournalGroupUtils) GetGroupVirTreeData(groupId int) (*VirTreeData, error) {
	data, err := group.GetGroup(groupId)
	if err != nil {
		return nil, err
	}
	return &data.Tree, err
}

// Group_Update updates an existing journal group.
// It retrieves the current data, merges the new data, updates the cache, and updates the meta file.
//
// Parameters:
//   - groupId: The ID of the journal group to update.
//   - newData: The new data to update the group with.
//
// Returns:
//   - *JournalGroupData: The updated journal group data.
//   - error: An error if the update fails.
func (group *JournalGroupUtils) UpdateGroup(groupId int, newData *JournalGroupUpdateSchema) (updatedGroupData *JournalGroupData, anyError error) {
	// Gets the previous data that has been saved
	groupData, someError := group.GetGroup(groupId)
	if someError != nil {
		return nil, someError
	}

	mergeGroupData(groupData, newData)

	// Make sure to update the meta data and cache data too.
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		cache.Set(utils.IntToString(groupData.Id), &groupData)
	})

	UpdateGroupMetaFile(groupData)

	return groupData, nil
}

// Deletes a journal group by its ID.
// It removes the group from cache and deletes the group's folder.
//
// Returns an error if the deletion fails.
//
// Parameters:
//   - groupId: The ID of the journal group to delete.
func (group *JournalGroupUtils) DeleteGroup(groupId int) error {
	// Firstly, it will delete from cache first
	groupDataPath := GetGroupPath(groupId)
	var updateError error
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		updateError = cache.Delete(utils.IntToString(groupId))
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

// Retrieves all journal groups from cache.
//
// Returns an array containing all journal group data.
func (group *JournalGroupUtils) GetAllGroup() []any {
	var out []any
	internals.ModifyCacheDb("journal-group", func(cache *internals.JSONCacheUtils) {
		out = cache.GetAllValue()
	})
	return out
}
