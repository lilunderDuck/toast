package misc

import (
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
)

type bin_PackageContentData struct {
	// - [0]: name
	// - [1]: description
	// - [2]: author url
	// - [3]: author name
	// - [4]: homepage url
	Data        []uint16 `cbor:"0,keyasint,omitempty"`
	Id          uint     `cbor:"1,keyasint,omitempty"`
	Maintainers int      `cbor:"2,keyasint,omitempty"`
	License     int      `cbor:"3,keyasint,omitempty"`
	Version     [3]int   `cbor:"4,keyasint,omitempty"`
}

type bin_PackageMetadata struct {
	// - [0]: name
	// - [1]: description
	// - [2]: homepage url
	Data []uint16 `cbor:"0,keyasint,omitempty"`
	Id   uint     `cbor:"1,keyasint,omitempty"`
}

const NULL_CHAR = "\000"

func (data *PackageMetadata) MarshalCBOR() ([]byte, error) {
	return cbor.Marshal(bin_PackageMetadata{
		Data: utils.CompressStrings(data.Name, data.Homepage),
		Id:   data.Id,
	})
}

func (data *PackageMetadata) UnmarshalCBOR(input []byte) error {
	var out bin_PackageMetadata
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	stringData := utils.DecompressStrings(out.Data)

	data.Name = stringData[0]
	data.Homepage = stringData[1]
	data.Id = out.Id
	return nil
}

func (data *PackageContentData) MarshalCBOR() ([]byte, error) {
	return cbor.Marshal(bin_PackageContentData{
		Data: utils.CompressStrings(
			data.Name,
			data.Description,
			data.Author.Url,
			data.Author.Name,
			data.Homepage,
		),
		Id: data.Id,
	})
}

func (data *PackageContentData) UnmarshalCBOR(input []byte) error {
	var out bin_PackageContentData
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	stringData := utils.DecompressStrings(out.Data)

	data.Name = stringData[0]
	data.Description = stringData[1]
	data.Author.Url = stringData[2]
	data.Author.Name = stringData[3]
	data.Homepage = stringData[4]
	data.Id = out.Id
	data.Maintainers = out.Maintainers
	// data.License = out.License
	return nil
}
