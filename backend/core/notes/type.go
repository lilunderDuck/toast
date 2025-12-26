package notes

import (
	"time"
	"toast/backend/core/editor"
	"toast/backend/utils"
)

type CreateNoteOptions struct {
	Name string `json:"name"`
}

type UpdateNoteOptions struct {
	Name string                   `json:"name,omitempty"`
	Data editor.EditorContentData `json:"data,omitempty"`
}

type NoteData struct {
	Id       string                   `json:"id"                 cbor:"0,keyasint"`
	Type     uint8                    `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration            `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration            `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string                   `json:"name"               cbor:"4,keyasint"`
	Data     editor.EditorContentData `json:"data"               cbor:"5,keyasint"`
}

func newNoteData(journalType uint8, options *CreateNoteOptions) *NoteData {
	return &NoteData{
		Id:      utils.GetRandomStringWithinLength(8),
		Type:    journalType,
		Created: utils.GetCurrentDateNow(),
		Name:    options.Name,
		Data:    *editor.NewEditorContentData(),
	}
}
