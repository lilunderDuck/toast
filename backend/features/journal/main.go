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
	return notes.GetService(groupId).Create(journalType, &options)
}

func (*Exports) GetJournal(groupId, journalId string) (*notes.NoteData, error) {
	return notes.GetService(groupId).Get(journalId)
}

func (group *Exports) UpdateJournal(
	groupId,
	journalId string,
	newData *notes.UpdateNoteOptions,
) error {
	return notes.GetService(groupId).Update(journalId, newData)
}

func (*Exports) DeleteJournal(groupId, journalId string) error {
	return notes.GetService(groupId).Delete(journalId)
}

func (*Exports) CleanUpJournal(groupId string) {
}
