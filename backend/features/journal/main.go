// Basically everything related to journal creation, deletion, and modification
package journal

import (
	"toast/backend/core/notes"
)

// This struct provides method to interact with journal (group) data.
//
// Every method in this struct are the public API to provide functionality to the frontend side.
type Exports struct{}

func (*Exports) CreateJournal(
	groupId string,
	journalType uint8,
	options notes.CreateNoteOptions,
) (*notes.NoteData, error) {
	service, err := notes.GetService(groupId)
	if err != nil {
		return nil, err
	}
	return service.Create(journalType, &options)
}

func (*Exports) GetJournal(groupId, journalId string) (*notes.NoteData, error) {
	service, err := notes.GetService(groupId)
	if err != nil {
		return nil, err
	}
	return service.Get(journalId)
}

func (group *Exports) UpdateJournal(
	groupId,
	journalId string,
	newData *notes.UpdateNoteOptions,
) error {
	service, err := notes.GetService(groupId)
	if err != nil {
		return err
	}
	return service.Update(journalId, newData)
}

func (*Exports) DeleteJournal(groupId, journalId string) error {
	service, err := notes.GetService(groupId)
	if err != nil {
		return nil
	}

	return service.Delete(journalId)
}

func (*Exports) CleanUpJournal(groupId string) {
	service, err := notes.GetService(groupId)
	if err != nil {
		return
	}

	service.CleanUp()
}
