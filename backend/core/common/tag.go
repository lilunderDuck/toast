package common

// implements: cbor.Marshaler, cbor.Unmarshaler
type TagData struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}
