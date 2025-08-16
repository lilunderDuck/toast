package journal

import (
	"fmt"
	"time"

	"github.com/fxamacker/cbor/v2"
)

// Options for creating a new journal.
type JournalOptions struct {
	Name string             `form:"name" json:"name" binding:"required"`
	Data JournalContentData `form:"data" json:"data"`
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

type compressed_JournalContentData struct {
	Type    uint8                `json:"type"             cbor:"0,keyasint"`
	Attrs   EditorAttributes     `json:"attrs,omitempty"  cbor:"1,keyasint"`
	Marks   []EditorMarks        `json:"marks,omitempty"  cbor:"2,keyasint"`
	Content []JournalContentData `json:"content"          cbor:"3,keyasint"`
	Text    string               `json:"text,omitempty"   cbor:"4,keyasint"`
}

var editorContentTypeMap = map[string]uint8{
	"doc":         0,
	"table":       1,
	"tableRow":    2,
	"tableHeader": 3,
	"tableCell":   4,
	"paragraph":   5,
	"text":        6,
}

var editorContentTypeRemap = map[uint8]string{
	0: "doc",
	1: "table",
	2: "tableRow",
	3: "tableHeader",
	4: "tableCell",
	5: "paragraph",
	6: "text",
}

func (data *JournalContentData) MarshalCBOR() ([]byte, error) {
	editorContentTypeMapping, ok := editorContentTypeMap[data.Type]
	if !ok {
		fmt.Printf("Missing case \"%s\" in the mapping", data.Type)
		editorContentTypeMapping = 255
	}

	return cbor.Marshal(compressed_JournalContentData{
		Type:    editorContentTypeMapping,
		Attrs:   data.Attrs,
		Marks:   data.Marks,
		Content: data.Content,
		Text:    data.Text,
	})
}

func (data *JournalContentData) UnmarshalCBOR(input []byte) error {
	var out compressed_JournalContentData
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	editorContentTypeMapping, ok := editorContentTypeRemap[out.Type]
	if !ok {
		fmt.Printf("Missing case \"%s\" in the mapping", data.Type)
		editorContentTypeMapping = "unsupported"
	}

	data.Type = editorContentTypeMapping

	return nil
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

type compressed_EditorMarks struct {
	Type uint8  `json:"type"             cbor:"0,keyasint"`
	Text string `json:"text,omitempty"   cbor:"1,keyasint"`
}

var editorMarkTypeMap = map[string]uint8{
	// ... empty ...
}

var editorMarkTypeRemap = map[uint8]string{
	// ... empty ...
}

func (data *EditorMarks) MarshalCBOR() ([]byte, error) {
	editorMarkType, ok := editorMarkTypeMap[data.Type]
	if !ok {
		fmt.Printf("Missing case \"%s\" in the mapping", data.Type)
		editorMarkType = 255
	}

	return cbor.Marshal(compressed_EditorMarks{
		Type: editorMarkType,
		Text: data.Text,
	})
}

func (data *EditorMarks) UnmarshalCBOR(input []byte) error {
	var out compressed_EditorMarks
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	editorMarkType, ok := editorMarkTypeRemap[out.Type]
	if !ok {
		fmt.Printf("Missing case \"%s\" in the mapping", data.Type)
		editorMarkType = "unsupported"
	}

	data.Type = editorMarkType

	return nil
}
