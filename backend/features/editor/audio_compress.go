package editor

import (
	"time"

	"github.com/fxamacker/cbor/v2"
)

type bin_PlaylistItemData struct {
	Data []uint16 `cbor:"0,keyasint"`
	Id   int      `cbor:"1,keyasint"`
}

type bin_PlaylistMetadata struct {
	Data     []uint16           `cbor:"0,keyasint"`
	Items    []PlaylistItemData `cbor:"1,keyasint,omitempty"`
	Id       int                `cbor:"2,keyasint"`
	Created  time.Duration      `cbor:"3,keyasint,omitempty"`
	Modified time.Duration      `cbor:"4,keyasint,omitempty"`
}

func (audio *PlaylistMetadata) MarshalCBOR() ([]byte, error) {
	stringData := CompressStrings(audio.Title, audio.Description, audio.Icon)
	return cbor.Marshal(bin_PlaylistMetadata{
		Data:  stringData,
		Items: audio.Items,
		Id:    audio.Id,
	})
}

func (audioItem *PlaylistItemData) MarshalCBOR() ([]byte, error) {
	stringData := CompressStrings(
		audioItem.Name,
		audioItem.Author,
		audioItem.Description,
		audioItem.Icon,
	)

	return cbor.Marshal(bin_PlaylistItemData{
		Data: stringData,
	})
}

func (audio *PlaylistMetadata) UnmarshalCBOR(input []byte) error {
	var out bin_PlaylistMetadata
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	stringData := DecompressStrings(out.Data)

	audio.Title = stringData[0]
	audio.Description = stringData[1]
	audio.Icon = stringData[2]
	audio.Items = out.Items
	audio.Id = out.Id
	return nil
}

func (audioItem *PlaylistItemData) UnmarshalCBOR(input []byte) error {
	var out bin_PlaylistItemData
	if err := cbor.Unmarshal(input, &out); err != nil {
		return err
	}

	stringData := DecompressStrings(out.Data)

	audioItem.Name = stringData[0]
	audioItem.Author = stringData[1]
	audioItem.Description = stringData[2]
	audioItem.Icon = stringData[3]
	audioItem.Id = out.Id
	return nil
}
