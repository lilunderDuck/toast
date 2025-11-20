package notes

import (
	"path/filepath"
	"toast/backend/core/group"
	"toast/backend/db"
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
)

type Service struct {
	Db        *db.Instance
	SavedPath string
}

func NewService(groupId string) (*Service, error) {
	basePath := filepath.Join(group.GetBasePath(), groupId)
	db, err := db.Open(filepath.Join(basePath, "notes"))
	if err != nil {
		return nil, err
	}

	return &Service{
		SavedPath: basePath,
		Db:        db,
	}, nil
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
	return note.Db.Delete([]byte(noteId))
}

func (note *Service) Write(noteId string, data *NoteData) error {
	binData, err := cbor.Marshal(data)
	if err != nil {
		return err
	}

	return note.Db.Set([]byte(noteId), binData)
}

func (note *Service) Read(noteId string) (*NoteData, error) {
	binData, err := note.Db.Get([]byte(noteId))
	if err != nil {
		return nil, err
	}

	return utils.BSON_Unmarshal[NoteData](binData)
}

func (note *Service) CleanUp() {
	note.Db.Close()
}
