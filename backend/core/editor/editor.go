package editor

type EditorId string

func NewEditorContentData() *EditorContentData {
	return &EditorContentData{
		Type:    "doc",
		Content: []EditorContentData{},
	}
}

type EditorContentData struct { // impls cbor.Marshaler, cbor.Unmarshaler
	Type    string              `json:"type"             cbor:"0,keyasint"`
	Attrs   EditorAttributes    `json:"attrs,omitempty"  cbor:"1,keyasint,omitempty"  copier:"Attrs"`
	Marks   []EditorMarks       `json:"marks,omitempty"  cbor:"2,keyasint,omitempty"  copier:"Marks"`
	Content []EditorContentData `json:"content"          cbor:"3,keyasint"            copier:"Content"`
	Text    string              `json:"text,omitempty"   cbor:"4,keyasint,omitempty"  copier:"Text"`
}

type bin_EditorContentData struct {
	Type    uint8               `cbor:"0,keyasint"`
	Attrs   EditorAttributes    `cbor:"1,keyasint,omitempty"  copier:"Attrs"`
	Marks   []EditorMarks       `cbor:"2,keyasint,omitempty"  copier:"Marks"`
	Content []EditorContentData `cbor:"3,keyasint"            copier:"Content"`
	Text    string              `cbor:"4,keyasint,omitempty"  copier:"Text"`
}

type EditorAttributes struct {
	// ... color style attributes ...
	BackgroundColor string `json:"backgroundColor,omitempty"   cbor:"0,keyasint,omitempty"`
	Color           string `json:"color,omitempty"   cbor:"1,keyasint,omitempty"`

	Id string `json:"id,omitempty"   cbor:"3,keyasint,omitempty"`

	// Image, video node attribute

	Name string `json:"name,omitempty"   cbor:"4,keyasint,omitempty"`

	// Gallery node attribute

	ViewMode uint8 `json:"viewMode,omitempty" cbor:"8,keyasint,omitempty"`
}

type bin_EditorAttributes struct {
	// ... color style attributes ...
	BackgroundColor string `json:"backgroundColor,omitempty"   cbor:"0,keyasint,omitempty"`
	Color           string `json:"color,omitempty"   cbor:"1,keyasint,omitempty"`

	Id string `json:"id,omitempty"   cbor:"3,keyasint,omitempty"`

	// Image, video node attribute

	Name string `json:"name,omitempty"   cbor:"4,keyasint,omitempty"`

	// Gallery node attribute

	ViewMode uint8 `json:"viewMode,omitempty" cbor:"8,keyasint,omitempty"`
}

type EditorMarks struct { // impls cbor.Marshaler, cbor.Unmarshaler
	Type string `json:"type"             cbor:"0,keyasint"`
	Text string `json:"text,omitempty"   cbor:"1,keyasint,omitempty"`
}

type bin_EditorMarks struct {
	Type uint8  `cbor:"0,keyasint"`
	Text string `cbor:"1,keyasint,omitempty"`
}
