package editor_data

type VideoData struct {
	VideoName string              `json:"videoName,omitempty"    cbor:"20,keyasint,omitempty"`
	Subtitles []VideoSubtitleData `json:"subtitles,omitempty"    cbor:"21,keyasint,omitempty"`
	Chapters  []VideoChapterData  `json:"chapters,omitempty"     cbor:"22,keyasint,omitempty"`
}

type VideoSubtitleData struct {
	From uint       `json:"from"     cbor:"0,keyasint"`
	To   uint       `json:"to"       cbor:"1,keyasint"`
	Text []TextData `json:"text"     cbor:"2,keyasint"`
}

type VideoChapterData struct {
	From uint       `json:"from"     cbor:"0,keyasint"`
	To   uint       `json:"to"       cbor:"1,keyasint"`
	Text []TextData `json:"text"     cbor:"2,keyasint"`
}
