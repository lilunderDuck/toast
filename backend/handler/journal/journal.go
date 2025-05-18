package journal

import (
	"burned-toast/backend/handler/editor_data"
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"time"
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

// Represents the complete data for a journal entry,
type JournalData struct {
	Id       int                  `json:"id"                 cbor:"0,keyasint"`
	Type     uint8                `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration        `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration        `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string               `json:"name"               cbor:"4,keyasint"`
	Data     []JournalContentData `json:"data"               cbor:"5,keyasint"`
}

type JournalMetaData struct {
	Id       int           `json:"id"`
	Type     uint8         `json:"type"`
	Created  time.Duration `json:"created"`
	Modified time.Duration `json:"modified,omitempty"`
	Name     string        `json:"name"`
}

// Represents the data for a single content block within a journal entry.
type JournalContentData struct {
	Id   int                    `json:"id"              cbor:"0,keyasint"`
	Type uint16                 `json:"type"            cbor:"1,keyasint"`
	Data editor_data.EditorData `json:"data"            cbor:"3,keyasint"`
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
func CreateJournal(currentGroupId int, schema *JournalSchema) *JournalData {
	stringJournalId, numberId := utils.GenerateRandomNumberId()

	newData := JournalData{
		Id:      numberId,
		Type:    uint8(TYPE_JOURNAL),
		Created: utils.GetCurrentDateNow(),
		Name:    schema.Name,
	}

	utils.BSON_WriteFile(
		internals.GetJournalSavedFilePath(currentGroupId, newData.Id),
		&newData,
	)

	newData.Data = []JournalContentData{}

	internals.OpenDb(utils.IntToString(currentGroupId), func(cache *internals.JSONCacheUtils) {
		cache.Set(stringJournalId, &newData)
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
func GetJournal(currentGroupId int, journalId int) (*JournalData, error) {
	var dataOut JournalData
	err := utils.BSON_ReadFile(
		internals.GetJournalSavedFilePath(currentGroupId, journalId),
		&dataOut,
	)

	if err != nil {
		return nil, err
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
func UpdateJournal(currentGroupId int, journalId int, newData *JournalUpdateSchema) (*JournalData, error) {
	data, err := GetJournal(currentGroupId, journalId)
	if err != nil {
		return nil, err
	}

	mergeJournalData(data, newData)

	writeError := utils.BSON_WriteFile(
		internals.GetJournalSavedFilePath(currentGroupId, journalId),
		&data,
	)

	if writeError != nil {
		return nil, writeError
	}

	internals.OpenDb(utils.IntToString(currentGroupId), func(cache *internals.JSONCacheUtils) {
		cache.Set(utils.IntToString(data.Id), &JournalMetaData{
			Id:       data.Id,
			Type:     data.Type,
			Created:  data.Created,
			Modified: data.Modified,
			Name:     data.Name,
		})
	})

	return data, nil
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

// Deletes a journal entry by its ID from a specified journal group.
// It removes the journal's file and removes the journal from cache.
//
// Returns an error if the deletion fails.
//
// Parameters:
//   - currentGroupId: The ID of the journal group.
//   - journalId: The ID of the journal entry to delete.
func DeleteJournal(currentGroupId int, journalId int) error {
	removeError := utils.RemoveFileOrDirectory(internals.GetJournalSavedFilePath(currentGroupId, journalId))
	if removeError != nil {
		return removeError
	}

	internals.OpenDb(utils.IntToString(currentGroupId), func(cache *internals.JSONCacheUtils) {
		cache.Delete(utils.IntToString(journalId))
	})

	return nil
}

func GetAllJournal(currentGroupId int) map[string]any {
	var out map[string]any
	internals.OpenDb(utils.IntToString(currentGroupId), func(cache *internals.JSONCacheUtils) {
		out = cache.GetAll()
	})

	return out
}
