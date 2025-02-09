package journal

import (
	"server/handler/journal_group"
	"server/server"
	"server/utils"

	"github.com/akrylysov/pogreb"
)

func CreateJournal(currentGroupId int, schema *JournalSchema) *JournalData {
	stringJournalId, numberId := utils.GenerateRandomNumberId()

	newData := JournalData{
		Id:      numberId,
		Type:    uint8(Type_Journal),
		Created: utils.GetCurrentDateNow(),
		Name:    schema.Name,
		Data:    []JournalContentData{},
	}

	utils.CreateDirectory(GetJournalsSavedFolder(currentGroupId))
	utils.BSON_WriteFile(
		GetJournalSavedFilePath(currentGroupId, newData.Id),
		&newData,
	)

	journal_group.Update(currentGroupId, &journal_group.UpdateSchema{
		Item: numberId,
	})

	server.Cache_Update(utils.IntToString(currentGroupId), func(db *pogreb.DB) {
		server.Cache_Set(db, stringJournalId, &newData)
	})

	return &newData
}

func GetJournal(currentGroupId int, journalId int) (*JournalData, error) {
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

func UpdateJournal(currentGroupId int, journalId int, newData *JournalUpdateSchema) (*JournalData, error) {
	data, readError := GetJournal(currentGroupId, journalId)
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

	server.Cache_Update(utils.IntToString(currentGroupId), func(db *pogreb.DB) {
		server.Cache_Set(db, utils.IntToString(data.Id), &newData)
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

func DeleteJournal(currentGroupId int, journalId int) error {
	removeError := utils.RemoveFileOrDirectory(GetJournalSavedFilePath(currentGroupId, journalId))
	if removeError != nil {
		return removeError
	}

	server.Cache_Update(utils.IntToString(currentGroupId), func(db *pogreb.DB) {
		server.Cache_Delete(db, utils.IntToString(journalId))
	})

	return nil
}
