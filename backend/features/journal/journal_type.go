package journal

import (
	"time"
)

// Options for creating a new journal.
type JournalOptions struct {
	Name string               `form:"name" json:"name" binding:"required"`
	Data []JournalContentData `form:"data" json:"data"`
}

type JournalData struct {
	Id       int                `json:"id"                 cbor:"0,keyasint"`
	Type     uint8              `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration      `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration      `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string             `json:"name"               cbor:"4,keyasint"`
	Data     JournalContentData `json:"data"               cbor:"5,keyasint"`
}

// ----------- Editor data zone -------------

type JournalContentData struct { // impls cbor.Marshaler, cbor.Unmarshaler
	Type    string               `json:"type"             cbor:"0,keyasint"`
	Attrs   EditorAttributes     `json:"attrs,omitempty"  cbor:"1,keyasint"`
	Marks   []EditorMarks        `json:"marks,omitempty"  cbor:"2,keyasint"`
	Content []JournalContentData `json:"content"          cbor:"3,keyasint"`
	Text    string               `json:"text,omitempty"   cbor:"4,keyasint"`
}

type EditorAttributes struct {
	// ------ table attribute -------

	Colspan  uint `json:"colspan,omitempty"    cbor:"0,keyasint"`
	Rowspan  uint `json:"rowspan,omitempty"    cbor:"1,keyasint"`
	Colwidth uint `json:"colwidth,omitempty"   cbor:"2,keyasint"`
}

type EditorMarks struct { // impls cbor.Marshaler, cbor.Unmarshaler
	Type string `json:"type"             cbor:"0,keyasint"`
	Text string `json:"text,omitempty"   cbor:"1,keyasint"`
}
