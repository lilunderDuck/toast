package editor

import "time"

type PlaylistOptions struct {
	Title       string             `json:"title,omitempty"`
	Description string             `json:"description,omitempty"`
	Items       []PlaylistItemData `json:"items,omitempty"`
	Icon        string             `json:"icon,omitempty"`
}

type PlaylistMetadata struct {
	Title       string             `json:"title"`
	Description string             `json:"description,omitempty"`
	Items       []PlaylistItemData `json:"items"`
	Id          int                `json:"id"`
	Created     time.Duration      `json:"created"`
	Modified    time.Duration      `json:"modified,omitempty"`
	Icon        string             `json:"icon,omitempty"`
}

type PlaylistItemOptions struct {
	// The audio file path the user wish to upload
	FileName string `json:"fileName,omitempty"`
	// The audio icon path the user wish to upload.
	// If the audio file doesn't have cover icon, the user can upload their custom cover icon instead.
	IconPath string `json:"iconPath,omitempty"`
	// The audio's author
	Author string `json:"author,omitempty"`
	// Description of the audio file
	Description string `json:"description,omitempty"`
}

type PlaylistItemData struct {
	// The file name of the audio file
	FileName string `json:"fileName"`
	// The cover icon file name of the audio file, ususally it has the same
	// name as the audio file as well
	Icon string `json:"icon,omitempty"`
	// The track name
	Name string `json:"name,omitempty"`
	// The author of this track
	Author string `json:"author,omitempty"`
	// Description of the track
	Description string `json:"description,omitempty"`
	// Unique identifier of this playlist item
	Id int `json:"id"`
}
