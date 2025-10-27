// Basically everything related to journal creation, deletion, and modification
package journal

import "toast/backend/utils"

var journalsManager = NewJournalsManager()

// This struct provides method to interact with journal (group) data.
//
// Every method in this struct are the public API to provide functionality to the frontend side.
type Exports struct{}

func (*Exports) CreateJournal(
	groupId int,
	journalType uint8,
	options JournalOptions,
) (*JournalData, error) {
	newData := newJournal(journalType, &options)

	if err := journalsManager.Write(groupId, newData); err != nil {
		return nil, err
	}

	return newData, nil
}

func (*Exports) GetJournal(groupId, journalId int) (*JournalData, error) {
	return journalsManager.Read(groupId, journalId)
}

func (group *Exports) UpdateJournal(
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

	journalsManager.Write(groupId, data)

	return data, nil
}

func (*Exports) DeleteJournal(groupId, journalId int) {
	journalsManager.Delete(groupId, journalId)
}
