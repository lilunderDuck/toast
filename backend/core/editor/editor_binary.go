package editor

import (
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
)

type bin_EditorContentData struct {
	// Originally, this field is a string type, but it's converted to a uint8
	// just to save spaces, ofc.
	Type    uint8               `cbor:"0,keyasint"`
	Attrs   EditorAttributes    `cbor:"1,keyasint,omitempty"`
	Marks   []EditorMarks       `cbor:"2,keyasint,omitempty"`
	Content []EditorContentData `cbor:"3,keyasint"`
	Text    string              `cbor:"4,keyasint,omitempty"`
}

func (data *EditorContentData) MarshalCBOR() ([]byte, error) {
	return cbor.Marshal(bin_EditorContentData{
		Type:    utils.GetValueOrDefaultInMap(CONTENT_TYPE_MAP, data.Type),
		Attrs:   data.Attrs,
		Marks:   data.Marks,
		Content: data.Content,
		Text:    data.Text,
	})
}

func (data *EditorContentData) UnmarshalCBOR(input []byte) error {
	var out bin_EditorContentData
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	data.Type = utils.GetValueOrDefaultInMap(CONTENT_TYPE_REMAP, out.Type)
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

func (data *EditorMarks) MarshalCBOR() ([]byte, error) {
	return cbor.Marshal(bin_EditorMarks{
		Type: utils.GetValueOrDefaultInMap(MARK_TYPE_MAP, data.Type),
		Text: data.Text,
	})
}

func (data *EditorMarks) UnmarshalCBOR(input []byte) error {
	var out bin_EditorMarks
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	data.Type = utils.GetValueOrDefaultInMap(MARK_TYPE_REMAP, out.Type)
	data.Text = out.Text

	return nil
}
