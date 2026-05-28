package playlist

import (
	"toast/backend/debug"
	"toast/backend/utils"
)

func (playlist *Exports) Playlist_getAllTrack(id string) ([]PlaylistTrackData, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "getting all track data of %s", id)
	}
	return utils.ReadJsonFile[[]PlaylistTrackData](getPlaylistEntriesFilePath(id))
}

func (playlist *Exports) Playlist_updateTrack(id string, newData []PlaylistTrackData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "updating track from playlist id: %s - %#v", id, newData)
	}

	return utils.WriteJsonFile(getPlaylistEntriesFilePath(id), newData)
}
