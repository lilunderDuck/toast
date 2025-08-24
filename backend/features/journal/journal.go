package journal

import (
	"toast/backend/utils"
)

// ------ utils functions start here ------

// Save journal data to disk.
func writeJournalData(groupId, journalId int, data *JournalData) error {
	return utils.BSON_WriteFile(getJournalContentSavedFilePath(groupId, journalId), data)
}

// ------ actural implementation start here ------

func (*GroupExport) CreateJournal(groupId int, journalType uint8, options JournalOptions) (*JournalData, error) {
	journalId := utils.GetRandomInt()
	newData := JournalData{
		Id:       journalId,
		Type:     journalType,
		Created:  0,
		Modified: 0,
		Name:     options.Name,
	}

	if err := writeJournalData(groupId, journalId, &newData); err != nil {
		return nil, err
	}

	return &newData, nil
}

func (*GroupExport) GetJournal(groupId, journalId int) (*JournalData, error) {
	var data JournalData
	err := utils.BSON_ReadFile(getJournalContentSavedFilePath(groupId, journalId), &data)
	return &data, err
}

func (group *GroupExport) UpdateJournal(groupId, journalId int, newData *JournalOptions) (*JournalData, error) {
	data, err := group.GetJournal(groupId, journalId)
	if err != nil {
		return nil, err
	}

	// Is this the best way to update data?
	if newData.Name != "" {
		data.Name = newData.Name
	}

	if len(newData.Data) != 0 && newData.Data[0].Type == "doc" {
		data.Data = newData.Data[0]
	}

	writeJournalData(groupId, journalId, data)

	return data, nil
}

func (*GroupExport) DeleteJournal(groupId, journalId int) {
	utils.RemoveFileOrDirectory(getJournalContentSavedFilePath(groupId, journalId))
}
