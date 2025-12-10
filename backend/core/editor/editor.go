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
	Attrs   EditorAttributes    `json:"attrs,omitempty"  cbor:"1,keyasint,omitempty"`
	Marks   []EditorMarks       `json:"marks,omitempty"  cbor:"2,keyasint,omitempty"`
	Content []EditorContentData `json:"content"          cbor:"3,keyasint"`
	Text    string              `json:"text,omitempty"   cbor:"4,keyasint,omitempty"`
}

type EditorAttributes struct {
	Id string `json:"id,omitempty"   cbor:"3,keyasint,omitempty"`

	// Image, video node attribute

	Name  string `json:"name,omitempty"   cbor:"4,keyasint,omitempty"`
	Color string `json:"color,omitempty"  cbor:"5,keyasint,omitempty"`

	// Gallery node attribute

	ViewMode uint8 `json:"viewMode,omitempty" cbor:"8,keyasint,omitempty"`
}

type EditorMarks struct { // impls cbor.Marshaler, cbor.Unmarshaler
	Type string `json:"type"             cbor:"0,keyasint"`
	Text string `json:"text,omitempty"   cbor:"1,keyasint,omitempty"`
}
