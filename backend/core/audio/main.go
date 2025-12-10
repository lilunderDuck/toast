package audio

import (
	"fmt"
	"toast/backend/internals"
	"toast/backend/utils"
)

type Info struct {
	Title    string `json:"title,omitempty"`
	Artist   string `json:"artist,omitempty"`
	IconPath string `json:"iconPath,omitempty"`
}

func GetInfo(audioFile string) (*Info, error) {
	meta, err := mp3_readTag(audioFile)
	if err != nil {
		return nil, err
	}

	coverIconData := meta.Picture()
	coverIconPath := ""
	if coverIconData != nil {
		if coverIconData.Data != nil {
			coverIconPath = fmt.Sprintf("%s/%s.png", internals.CACHE_FOLDER_PATH, utils.GetRandomStringWithinLength(16))
			utils.WriteFile(coverIconPath, coverIconData.Data)
		}
	}

	return &Info{
		Title:    meta.Title(),
		Artist:   meta.Artist(),
		IconPath: coverIconPath,
	}, nil
}

func GetDuration(audioFile string) (float64, error) {
	return mp3_calculateDuration(audioFile)
}
