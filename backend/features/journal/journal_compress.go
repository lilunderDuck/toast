package journal

import (
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
)

type bin_JournalContentData struct {
	// Originally, this field is a string type, but it's converted to a uint8
	// just to save spaces, ofc.
	Type    uint8                `cbor:"0,keyasint"`
	Attrs   EditorAttributes     `cbor:"1,keyasint,omitempty"`
	Marks   []EditorMarks        `cbor:"2,keyasint,omitempty"`
	Content []JournalContentData `cbor:"3,keyasint"`
	Text    string               `cbor:"4,keyasint,omitempty"`
}

var editorContentTypeMap = map[string]uint8{
	"doc":         0,
	"table":       1,
	"tableRow":    2,
	"tableHeader": 3,
	"tableCell":   4,
	"paragraph":   5,
	"text":        6,
	"gallery":     7,
	"localEmbed":  8,
	"tag":         9,
	"image":       10,
	// "imageSplitView": 11, // unused
	"playlist": 12,
	"":         255,
}

var editorContentTypeRemap = map[uint8]string{
	0:  "doc",
	1:  "table",
	2:  "tableRow",
	3:  "tableHeader",
	4:  "tableCell",
	5:  "paragraph",
	6:  "text",
	7:  "gallery",
	8:  "localEmbed",
	9:  "tag",
	10: "image",
	// 11:  "imageSplitView", // unused
	12:  "playlist",
	255: "",
}

func (data *JournalContentData) MarshalCBOR() ([]byte, error) {
	return cbor.Marshal(bin_JournalContentData{
		Type:    utils.GetValueOrDefault(editorContentTypeMap, data.Type, 255),
		Attrs:   data.Attrs,
		Marks:   data.Marks,
		Content: data.Content,
		Text:    data.Text,
	})
}

func (data *JournalContentData) UnmarshalCBOR(input []byte) error {
	var out bin_JournalContentData
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	data.Type = utils.GetValueOrDefault(editorContentTypeRemap, out.Type, "unsupported")
	// Ugh-, I forgot to assign
	data.Attrs = out.Attrs
	data.Content = out.Content
	data.Text = out.Text

	return nil
}

type bin_EditorMarks struct {
	// Originally, this field is a string type, but it's converted to a uint8
	// just to save spaces, ofc.
	Type uint8  `cbor:"0,keyasint"`
	Text string `cbor:"1,keyasint,omitempty"`
}

var editorMarkTypeMap = map[string]uint8{
	// ... empty ...
}

var editorMarkTypeRemap = map[uint8]string{
	// ... empty ...
}

func (data *EditorMarks) MarshalCBOR() ([]byte, error) {
	return cbor.Marshal(bin_EditorMarks{
		Type: utils.GetValueOrDefault(editorMarkTypeMap, data.Type, 255),
		Text: data.Text,
	})
}

func (data *EditorMarks) UnmarshalCBOR(input []byte) error {
	var out bin_EditorMarks
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	data.Type = utils.GetValueOrDefault(editorMarkTypeRemap, out.Type, "unsupported")
	data.Text = out.Text

	return nil
}
