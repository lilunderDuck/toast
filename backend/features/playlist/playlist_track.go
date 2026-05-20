package playlist

import (
	"toast/backend/db"
	"toast/backend/debug"
	"toast/backend/utils"
)

func playlistDb(id string) *db.Instance {
	return db.GetInstance(getPlaylistPath(id))
}

func (playlist *Exports) Playlist_getAllTrack(id string) ([]PlaylistTrackData, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "getting all track data of %s", id)
	}
	return utils.ReadJsonFile[[]PlaylistTrackData](getPlaylistEntriesFilePath(id))
}

func (playlist *Exports) Playlist_addTrack(id string, data PlaylistTrackData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "adding playlist tracks: %#v", data)
	}

	return playlistDb(id).Set(id, utils.StringifyJson(data))
}

func (playlist *Exports) Playlist_updateTrack(id string, newData PlaylistTrackData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "updating track from playlist id: %s - %#v", id, newData)
	}

	return playlistDb(id).Update(id, func(oldDataInDb string) (string, error) {
		data, err := utils.ParseJsonString[PlaylistTrackData](oldDataInDb)
		if err != nil {
			return "", err
		}

		mergePlaylistTrackData(&data, newData)

		return utils.StringifyJson(data), nil
	})
}
