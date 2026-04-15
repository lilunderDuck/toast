package playlist

import (
	"encoding/json"
	"os"
	"toast/backend/debug"
	"toast/backend/internals"
)

func (*Exports) GetAllPlaylistTrack(id int) (*[]PlaylistTrackData, error) {
	if debug.DEBUG_MODE {
		debug.LogLabelf("playlist", "Getting all playlist tracks with id: %d", id)
	}
	data, err := os.ReadFile(internals.PlaylistPathRegistry.TracksData(id))
	if err != nil {
		return nil, err
	}

	var out []PlaylistTrackData
	err = json.Unmarshal(data, &out)
	return &out, err
}

func (*Exports) AddPlaylistTrackData(id int, data PlaylistTrackData) error {
	if debug.DEBUG_MODE {
		debug.LogLabelf("playlist", "Adding playlist tracks: %#v", data)
	}
	driver := playlistDbs[id]
	return driver.Insert(data)
}

func (*Exports) UpdatePlaylistTrackData(id int, data *PlaylistTrackData) error {
	if debug.DEBUG_MODE {
		debug.LogLabelf("playlist", "Updating track from playlist id: %d - %#v", id, data)
	}
	driver := playlistDbs[id]

	var playlistData PlaylistTrackData
	err := driver.Open(PlaylistTrackData{}).
		Where("id", "=", data.Id).
		First().
		AsEntity(&playlistData)
	//
	if err != nil {
		return err
	}

	if data.Artist != "" {
		playlistData.Artist = data.Artist
	}

	if data.Duration != 0 {
		playlistData.Duration = data.Duration
	}

	if data.Icon != "" {
		playlistData.Icon = data.Icon
	}

	if data.Name != "" {
		playlistData.Name = data.Name
	}

	return driver.Update(playlistData)
}
