package journal

import (
	"time"
	"toast/backend/utils"
)

// Options for creating a new journal.
type JournalOptions struct {
	Name string               `form:"name" json:"name" binding:"required"`
	Data []JournalContentData `form:"data" json:"data"`
}

type JournalData struct {
	Id       string             `json:"id"                 cbor:"0,keyasint"`
	Type     uint8              `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration      `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration      `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string             `json:"name"               cbor:"4,keyasint"`
	Data     JournalContentData `json:"data"               cbor:"5,keyasint"`
}

func newJournal(journalType uint8, options *JournalOptions) *JournalData {
	return &JournalData{
		Id:      utils.GetRandomStringWithinLength(8),
		Type:    journalType,
		Created: utils.GetCurrentDateNow(),
		Name:    options.Name,
	}
}

// ----------- Editor data zone -------------

type JournalContentData struct { // impls cbor.Marshaler, cbor.Unmarshaler
	Type    string               `json:"type"             cbor:"0,keyasint"`
	Attrs   EditorAttributes     `json:"attrs,omitempty"  cbor:"1,keyasint,omitempty"`
	Marks   []EditorMarks        `json:"marks,omitempty"  cbor:"2,keyasint,omitempty"`
	Content []JournalContentData `json:"content"          cbor:"3,keyasint"`
	Text    string               `json:"text,omitempty"   cbor:"4,keyasint,omitempty"`
}

type EditorAttributes struct {
	// ------ table attribute -------

	Colspan  uint `json:"colspan,omitempty"    cbor:"0,keyasint,omitempty"`
	Rowspan  uint `json:"rowspan,omitempty"    cbor:"1,keyasint,omitempty"`
	Colwidth uint `json:"colwidth,omitempty"   cbor:"2,keyasint,omitempty"`

	// ------ generic custom node attribute ------

	Id int `json:"id,omitempty"   cbor:"3,keyasint,omitempty"`

	// Image, video node attribute

	Name  string `json:"name,omitempty"   cbor:"4,keyasint,omitempty"`
	Color string `json:"color,omitempty"  cbor:"5,keyasint,omitempty"`

	// image split view node attributes

	LeftImage  ImageSplitViewAttribute `json:"leftImage,omitempty" cbor:"6,keyasint,omitempty"`
	RightImage ImageSplitViewAttribute `json:"rightImage,omitempty" cbor:"7,keyasint,omitempty"`

	// Gallery node attribute

	ViewMode uint8 `json:"viewMode,omitempty" cbor:"8,keyasint,omitempty"`
}

type ImageSplitViewAttribute struct {
	Name string `json:"name,omitempty"   cbor:"0,keyasint,omitempty"`
}

type EditorMarks struct { // impls cbor.Marshaler, cbor.Unmarshaler
	Type string `json:"type"             cbor:"0,keyasint"`
	Text string `json:"text,omitempty"   cbor:"1,keyasint,omitempty"`
}
