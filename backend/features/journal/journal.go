package journal

import (
	"toast/backend/utils"
)

func (*GroupExport) CreateJournal(
	groupId int,
	journalType uint8,
	options JournalOptions,
) (*JournalData, error) {
	journalId := utils.GetRandomInt()
	newData := JournalData{
		Id:      journalId,
		Type:    journalType,
		Created: utils.GetCurrentDateNow(),
		Name:    options.Name,
	}

	if err := writeJournalData(groupId, journalId, &newData); err != nil {
		return nil, err
	}

	return &newData, nil
}

func (*GroupExport) GetJournal(groupId, journalId int) (*JournalData, error) {
	return readJournalData(groupId, journalId)
}

func (group *GroupExport) UpdateJournal(
	groupId,
	journalId int,
	newData *JournalOptions,
) (*JournalData, error) {
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

	data.Modified = utils.GetCurrentDateNow()

	writeJournalData(groupId, journalId, data)

	return data, nil
}

func (*GroupExport) DeleteJournal(groupId, journalId int) {
	deleteJournalData(groupId, journalId)
}
