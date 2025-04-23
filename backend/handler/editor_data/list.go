package editor_data

type ListType uint8

const (
	LIST_TYPE__ORDERED   ListType = 0
	LIST_TYPE__UNORDERED ListType = 1
)

type ListData struct {
	Items [][]TextData `json:"items,omitempty"     cbor:"30,keyasint,omitempty"`
	Type  ListType     `json:"type,omitempty"      cbor:"31,keyasint,omitempty"`
}
