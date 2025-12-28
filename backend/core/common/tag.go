package common

// implements: cbor.Marshaler, cbor.Unmarshaler
type TagData struct {
	Name  string `json:"name"   cbor:"0,keyasint"`
	Color string `json:"color"  cbor:"1,keyasint"`
}
