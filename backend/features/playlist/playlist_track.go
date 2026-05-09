package playlist

import (
	"os"
	"strconv"
	"toast/backend/db"
	"toast/backend/debug"
	"toast/backend/utils"
)

func playlistDb(id int) *db.Instance {
	return db.GetInstance(getPlaylistPath(id))
}

func (playlist *Exports) GetAllPlaylistTrack(id int) ([]PlaylistTrackData, error) {
	rawData, err := os.ReadFile(getPlaylistEntriesFilePath(id))
	if err != nil {
		return nil, err
	}

	data, err := utils.ParseJson[[]PlaylistTrackData](rawData)
	return data, err
}

func (playlist *Exports) AddPlaylistTrackData(id int, data PlaylistTrackData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "Adding playlist tracks: %#v", data)
	}

	return playlistDb(id).Set(strconv.Itoa(id), utils.StringifyJson(data))
}

func (playlist *Exports) UpdatePlaylistTrackData(id int, newData PlaylistTrackData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "Updating track from playlist id: %d - %#v", id, newData)
	}

	return playlistDb(id).Update(strconv.Itoa(id), func(oldDataInDb string) (string, error) {
		data, err := utils.ParseJsonString[PlaylistTrackData](oldDataInDb)
		if err != nil {
			return "", err
		}

		if data.Artist != "" {
			data.Artist = newData.Artist
		}

		if data.Duration != 0 {
			data.Duration = newData.Duration
		}

		if data.Icon != "" {
			data.Icon = newData.Icon
		}

		if data.Name != "" {
			data.Name = newData.Name
		}

		return utils.StringifyJson(data), nil
	})
}
