package playlist

import (
	"toast/backend/debug"
	"toast/backend/utils"
)

func (playlist *Exports) Playlist_get(playlistId string) (*PlaylistData, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "get playlist %s...", playlistId)
	}

	data, err := utils.ReadJsonFile[PlaylistData](getPlaylistMetadataFilePath(playlistId))
	if debug.DEBUG_MODE {
		if err != nil {
			debug.ErrLabel("playlist", err)
		}
	}

	return &data, err // if there's an error, then this returns nil and err
}

func (playlist *Exports) Playlist_create(data PlaylistData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabel("playlist", "creating playlist...")
	}

	err := playlist.database.Set(data.Id, utils.StringifyJson(data))
	if err != nil {
		return err
	}

	utils.CreateDirectory(getPlaylistPath(data.Id))
	utils.CreateDirectory(getTrackIconPath(data.Id, ""))
	utils.CreateDirectory(getTrackPath(data.Id, ""))
	utils.WriteJsonFile(getPlaylistMetadataFilePath(data.Id), data)
	utils.WriteJsonFile(getPlaylistEntriesFilePath(data.Id), []PlaylistTrackData{})

	return err
}

func (playlist *Exports) Playlist_update(id string, newData PlaylistData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabel("playlist", "updating playlist...")
	}

	mergedData := PlaylistData{}
	err := playlist.database.Update(id, func(oldRawData string) (string, error) {
		data, err := utils.ParseJsonString[PlaylistData](oldRawData)
		if err != nil {
			return "", err
		}

		MergePlaylistData(&data, newData)

		mergedData = data
		return utils.StringifyJson(data), nil
	})

	if err != nil {
		return err
	}

	return writePlaylistMetadataFile(id, mergedData)
}

func (playlist *Exports) Playlist_delete(id string) {
	panic("TODO: should just delete the playlist instead of panicing")
}
