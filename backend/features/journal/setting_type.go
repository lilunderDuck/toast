package journal

type Setting struct {
	Tags []TagData `json:"tags,omitempty"         cbor:"0,keyasint"`
}

type TagData struct {
	Name        string `json:"name"                    cbor:"0,keyasint"`
	Color       string `json:"color"                   cbor:"1,keyasint"`
	Description string `json:"description,omitempty"   cbor:"2,keyasint"`
}
