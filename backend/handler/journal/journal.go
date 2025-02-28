package journal

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"time"

	"github.com/akrylysov/pogreb"
)

// Defines the structure for creating a new journal entry.
type JournalSchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

// Defines the structure for updating an existing journal entry.
type JournalUpdateSchema struct {
	Name string               `form:"name" json:"name"`
	Data []JournalContentData `form:"data" json:"data"`
}

// Represents the type of a journal entry.
type JournalType uint8

const (
	// A regular journal.
	Type_Journal JournalType = 0
	// A category entry, think of it as a folder.
	Type_Category JournalType = 1
)

// Represents the complete data for a journal entry,
type JournalData struct {
	Id       int                  `json:"id"                 cbor:"0,keyasint"`
	Type     uint8                `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration        `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration        `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string               `json:"name"               cbor:"4,keyasint"`
	Data     []JournalContentData `json:"data"               cbor:"5,keyasint"`
}

// Represents the data for a single content block within a journal entry.
type JournalContentData struct {
	Id   int    `json:"id"              cbor:"0,keyasint"`
	Type uint16 `json:"type"            cbor:"1,keyasint"`
	Data any    `json:"data"            cbor:"3,keyasint,toarray"`
}

// Creates a new journal entry within a specified journal group.
// It generates a unique ID, creates the journal data, saves it to file,
// updates the journal group's tree, and adds the journal to cache.
//
// Returns the created journal entry data.
//
// Parameters:
//   - currentGroupId: The ID of the journal group to create the entry in.
//   - schema: The data for the new journal entry.
func Journal_Create(currentGroupId int, schema *JournalSchema) *JournalData {
	stringJournalId, numberId := utils.GenerateRandomNumberId()

	newData := JournalData{
		Id:      numberId,
		Type:    uint8(Type_Journal),
		Created: utils.GetCurrentDateNow(),
		Name:    schema.Name,
		Data:    []JournalContentData{},
	}

	utils.BSON_WriteFile(
		GetJournalSavedFilePath(currentGroupId, newData.Id),
		&newData,
	)

	Group_Update(currentGroupId, &JournalGroupUpdateSchema{
		Item: numberId,
	})

	internals.Cache_Update(utils.IntToString(currentGroupId), func(db *pogreb.DB) {
		internals.Cache_Set(db, stringJournalId, &newData)
	})

	return &newData
}

// Retrieves a journal entry by its ID from a specified journal group.
// It reads the data from the journal's file.
//
// Parameters:
//   - currentGroupId: The ID of the journal group.
//   - journalId: The ID of the journal entry.
//
// Returns:
//   - he journal entry data.
//   - An error if the journal entry is not found or reading fails.
func Journal_Get(currentGroupId int, journalId int) (*JournalData, error) {
	var dataOut JournalData
	readError := utils.BSON_ReadFile(
		GetJournalSavedFilePath(currentGroupId, journalId),
		&dataOut,
	)

	if readError != nil {
		return nil, readError
	}

	return &dataOut, nil
}

// Updates an existing journal entry within a specified journal group.
// It retrieves the current data, merges the new data, updates the cache, and updates the journal's file.
//
// Parameters:
//   - currentGroupId: The ID of the journal group.
//   - journalId: The ID of the journal entry to update.
//   - newData: The new data to update the journal entry with.
//
// Returns:
//   - The updated journal entry data.
//   - An error if the update fails.
func Journal_Update(currentGroupId int, journalId int, newData *JournalUpdateSchema) (*JournalData, error) {
	data, readError := Journal_Get(currentGroupId, journalId)
	if readError != nil {
		return nil, readError
	}

	if newData.Name != "" {
		data.Name = newData.Name
	}

	if len(newData.Data) != 0 {
		data.Data = newData.Data
	}

	data.Modified = utils.GetCurrentDateNow()

	internals.Cache_Update(utils.IntToString(currentGroupId), func(db *pogreb.DB) {
		internals.Cache_Set(db, utils.IntToString(data.Id), &data)
	})

	writeError := utils.BSON_WriteFile(
		GetJournalSavedFilePath(currentGroupId, journalId),
		&data,
	)

	if writeError != nil {
		return nil, writeError
	}

	return data, nil
}

// Deletes a journal entry by its ID from a specified journal group.
// It removes the journal's file and removes the journal from cache.
//
// Returns an error if the deletion fails.
//
// Parameters:
//   - currentGroupId: The ID of the journal group.
//   - journalId: The ID of the journal entry to delete.
func Journal_Delete(currentGroupId int, journalId int) error {
	removeError := utils.RemoveFileOrDirectory(GetJournalSavedFilePath(currentGroupId, journalId))
	if removeError != nil {
		return removeError
	}

	internals.Cache_Update(utils.IntToString(currentGroupId), func(db *pogreb.DB) {
		internals.Cache_Delete(db, utils.IntToString(journalId))
	})

	return nil
}
