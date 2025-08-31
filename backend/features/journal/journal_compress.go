package journal

import (
	"fmt"

	"github.com/fxamacker/cbor/v2"
)

type compressed_JournalContentData struct {
	// Originally, this field is a string type, but it's converted to a uint8
	// just to save spaces, ofc.
	Type    uint8                `json:"type"             cbor:"0,keyasint"`
	Attrs   EditorAttributes     `json:"attrs,omitempty"  cbor:"1,keyasint,omitempty"`
	Marks   []EditorMarks        `json:"marks,omitempty"  cbor:"2,keyasint,omitempty"`
	Content []JournalContentData `json:"content"          cbor:"3,keyasint"`
	Text    string               `json:"text,omitempty"   cbor:"4,keyasint,omitempty"`
}

var editorContentTypeMap = map[string]uint8{
	"doc":            0,
	"table":          1,
	"tableRow":       2,
	"tableHeader":    3,
	"tableCell":      4,
	"paragraph":      5,
	"text":           6,
	"gallery":        7,
	"localEmbed":     8,
	"tag":            9,
	"image":          10,
	"imageSplitView": 11,
	"":               255,
}

var editorContentTypeRemap = map[uint8]string{
	0:   "doc",
	1:   "table",
	2:   "tableRow",
	3:   "tableHeader",
	4:   "tableCell",
	5:   "paragraph",
	6:   "text",
	7:   "gallery",
	8:   "localEmbed",
	9:   "tag",
	10:  "image",
	11:  "imageSplitView",
	255: "",
}

func (data *JournalContentData) MarshalCBOR() ([]byte, error) {
	editorContentTypeMapping, ok := editorContentTypeMap[data.Type]
	if !ok {
		fmt.Printf("Missing case \"%s\" in the mapping\n", data.Type)
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
		fmt.Printf("Missing case \"%s\" in the remapping\n", data.Type)
		editorContentTypeMapping = "unsupported"
	}

	data.Type = editorContentTypeMapping
	// Ugh-, I forgot to assign
	data.Attrs = out.Attrs
	data.Content = out.Content
	data.Text = out.Text

	return nil
}

type compressed_EditorMarks struct {
	// Originally, this field is a string type, but it's converted to a uint8
	// just to save spaces, ofc.
	Type uint8  `json:"type"             cbor:"0,keyasint"`
	Text string `json:"text,omitempty"   cbor:"1,keyasint,omitempty"`
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
	data.Text = out.Text

	return nil
}
