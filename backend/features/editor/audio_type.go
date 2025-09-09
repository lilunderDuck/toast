package editor

type PlaylistOptions struct {
	Title       string             `json:"title,omitempty"`
	Description string             `json:"description,omitempty"`
	Items       []PlaylistItemData `json:"items,omitempty"`
}

type PlaylistItemOptions struct {
	Path        string `json:"path,omitempty"`
	Author      string `json:"author,omitempty"`
	Description string `json:"description,omitempty"`
	IconPath    string `json:"iconPath,omitempty"`
}

type PlaylistItemData struct {
	Name        string `json:"name,omitempty"`
	Author      string `json:"author,omitempty"`
	Description string `json:"description,omitempty"`
	Icon        string `json:"icon,omitempty"`
}

type PlaylistMetadata struct {
	Title       string             `json:"title"`
	Description string             `json:"description,omitempty"`
	Items       []PlaylistItemData `json:"items,omitempty"`
	Id          int                `json:"id,omitempty"`
}
