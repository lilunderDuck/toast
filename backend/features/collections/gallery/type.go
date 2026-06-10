package gallery

type GalleryData struct {
	Name string `json:"name"`
	Icon string `json:"icon,omitempty"`
	Id   string `json:"id"`
	Type byte   `json:"type"`
}

type GalleryItemData struct {
	FileName    string `json:"fileName"`
	Id          string `json:"id"`
	Description string `json:"description,omitempty"`
}
