package notes

import (
	"os"
	"path/filepath"
	"toast/backend/core/group"
	"toast/backend/utils"
)

type Service struct {
	SavedPath string
}

func NewService(groupId string) *Service {
	basePath := filepath.Join(group.GetBasePath(), groupId)

	return &Service{
		SavedPath: basePath,
	}
}

func (note *Service) Create(journalType uint8, options *CreateNoteOptions) (*NoteData, error) {
	noteData := newNoteData(journalType, options)
	if err := note.Write(noteData.Id, noteData); err != nil {
		return nil, err
	}

	return noteData, nil
}

func (note *Service) Get(noteId string) (*NoteData, error) {
	return note.Read(noteId)
}

func (note *Service) Update(noteId string, newData *UpdateNoteOptions) error {
	data, err := note.Read(noteId)
	if err != nil {
		return err
	}

	if newData.Name != "" {
		data.Name = newData.Name
	}

	if len(newData.Data.Content) != 0 {
		data.Data = newData.Data
	}

	data.Modified = utils.GetCurrentDateNow()

	if err := note.Write(noteId, data); err != nil {
		return err
	}

	return nil
}

// -------------------------------------------------------------------------------

func (note *Service) Delete(noteId string) error {
	return os.Remove(filepath.Join(note.SavedPath, noteId))
}

func (note *Service) Write(noteId string, data *NoteData) error {
	return utils.BSON_WriteFile(filepath.Join(note.SavedPath, noteId), data)
}

func (note *Service) Read(noteId string) (*NoteData, error) {
	return utils.BSON_ReadFile[NoteData](
		filepath.Join(note.SavedPath, noteId),
	)
}
