package common

import (
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
)

type bin_TagData struct {
	Name  utils.CompressedString
	Color EncodedTagColorData
}

func (data *TagData) MarshalCBOR() ([]byte, error) {
	return cbor.Marshal(bin_TagData{
		Name:  utils.MustCompressString(data.Name),
		Color: *parseColor(data.Color),
	})
}

func (data *TagData) UnmarshalCBOR(input []byte) error {
	var out bin_TagData
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	data.Name = utils.MustDecompressString(out.Name)
	data.Color = unparseColor(out.Color)

	return nil
}
