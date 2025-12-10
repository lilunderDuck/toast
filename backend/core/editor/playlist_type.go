package editor

import (
	"path/filepath"
	"strings"
	"time"
	"toast/backend/utils"
)

type PlaylistId uint64

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
	Id          string             `json:"id"`
	Created     time.Duration      `json:"created"`
	Modified    time.Duration      `json:"modified,omitempty"`
	Icon        string             `json:"icon,omitempty"`
}

func newPlaylistMetadata(options *PlaylistOptions) *PlaylistMetadata {
	return &PlaylistMetadata{
		Title:       options.Title,
		Description: options.Description,
		Id:          utils.GetRandomStringWithinLength(6),
		Created:     utils.GetCurrentDateNow(),
	}
}

type PlaylistItemOptions struct {
	// The audio file path the user wish to upload
	AudioFilePath string `json:"audioFilePath,omitempty"`
	// The audio icon path the user wish to upload.
	// If the audio file doesn't have cover icon, the user can upload their custom cover icon instead.
	IconPath string `json:"iconPath,omitempty"`
	Name     string `json:"name,omitempty"`
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
	Name string `json:"name"`
	// The author of this track
	Author string `json:"author,omitempty"`
	// Description of the track
	Description string `json:"description,omitempty"`
	// Unique identifier of this playlist item
	Id       PlaylistId `json:"id"`
	Duration int        `json:"duration"`
}

func NewPlaylistItemData(audioDuration int, options *PlaylistItemOptions) *PlaylistItemData {
	audioFileName := filepath.Base(options.IconPath)

	iconFileName := filepath.Base(options.IconPath)
	if iconFileName == "." {
		iconFileName = ""
	}

	if !utils.IsDefaultValue(options.IconPath) {
		options.IconPath = utils.RenameFileInPath(options.IconPath, func(_ string) string {
			return strings.Replace(audioFileName, filepath.Ext(audioFileName), "", 2)
		})
	}

	return &PlaylistItemData{
		Name:        options.Name,
		Author:      options.Author,
		Description: options.Description,
		FileName:    audioFileName,
		Icon:        iconFileName,
		Id:          PlaylistId(utils.GetRandomIntWithinLength(8)),
		Duration:    audioDuration,
	}
}
