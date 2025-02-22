package journal

import (
	"burned-toast/backend/handler/journal_group"
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"time"

	"github.com/akrylysov/pogreb"
)

type JournalSchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

type JournalUpdateSchema struct {
	Name string               `form:"name" json:"name"`
	Data []JournalContentData `form:"data" json:"data"`
}

type JournalType uint8

const (
	Type_Journal  JournalType = 0
	Type_Category JournalType = 1
)

type JournalData struct {
	Id       int                  `json:"id"                 cbor:"0,keyasint"`
	Type     uint8                `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration        `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration        `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string               `json:"name"               cbor:"4,keyasint"`
	Data     []JournalContentData `json:"data"               cbor:"5,keyasint"`
}

type JournalContentData struct {
	Id   int    `json:"id"              cbor:"0,keyasint"`
	Type uint16 `json:"type"            cbor:"1,keyasint"`
	Data any    `json:"data"            cbor:"3,keyasint,toarray"`
}

func Journal_Create(currentGroupId int, schema *JournalSchema) *JournalData {
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

	internals.Cache_Update(utils.IntToString(currentGroupId), func(db *pogreb.DB) {
		internals.Cache_Set(db, stringJournalId, &newData)
	})

	return &newData
}

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
