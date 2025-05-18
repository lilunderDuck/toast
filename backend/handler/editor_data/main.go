package editor_data

type EditorData struct {
	Text        []TextData `json:"text,omitempty"     cbor:"0,keyasint,omitempty"`
	Todos       []TodoData `json:"todos,omitempty"    cbor:"1,keyasint,omitempty"`
	ImageData              // 10
	VideoData              // 20
	ListData               // 30
	LinkData               // 40
	GalleryData            // 50
}
