package gallery

type GalleryData struct {
	Name        string `json:"name"`
	Icon        string `json:"icon,omitempty"`
	Id          string `json:"id"`
	Type        byte   `json:"type"`
	Description string `json:"description"`
}

type GalleryItemData struct {
	FileName    string                     `json:"fileName"`
	Id          string                     `json:"id"`
	Name        string                     `json:"name,omitempty"`
	Type        byte                       `json:"type"`
	Description string                     `json:"description,omitempty"`
	Subtitles   []GalleryVideoSubtitleData `json:"subtitles,omitempty"`
}

type GalleryVideoSubtitleData struct {
	Lang     string `json:"lang,omitempty"`
	FileName string `json:"fileName"`
}
