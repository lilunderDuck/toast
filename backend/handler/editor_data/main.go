package editor_data

type EditorData struct {
	Text  []TextData `json:"text,omitempty"     cbor:"0,keyasint,omitempty"`
	Todos []TodoData `json:"todos,omitempty"    cbor:"1,keyasint,omitempty"`
	ImageData
	VideoData
	ListData
	LinkData
}
