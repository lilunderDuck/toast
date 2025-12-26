package editor

import (
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
	"github.com/jinzhu/copier"
)

func (data *EditorContentData) MarshalCBOR() ([]byte, error) {
	target := bin_EditorContentData{
		Type: utils.GetValueOrDefaultInMap(CONTENT_TYPE_MAP, data.Type),
	}

	if err := copier.Copy(&target, data); err != nil {
		return nil, err
	}

	return cbor.Marshal(bin_EditorContentData{
		Type: utils.GetValueOrDefaultInMap(CONTENT_TYPE_MAP, data.Type),
	})
}

func (data *EditorContentData) UnmarshalCBOR(input []byte) error {
	var out bin_EditorContentData
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	data.Type = utils.GetValueOrDefaultInMap(CONTENT_TYPE_REMAP, out.Type)
	return copier.Copy(data, &out)
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
