package playlist

import (
	"os"
	"toast/backend/debug"
	"toast/backend/utils"
)

func (playlist *Exports) Playlist_getAll() []PlaylistData {
	if debug.DEBUG_MODE {
		debug.InfoLabel("playlist", "get all playlist...")
	}

	data, err := utils.ParseJsonString[[]PlaylistData](playlist.database.GetAll())
	if err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabelf("playlist", "The backend has ran into a grave mistake and the app can't do anything about it")
			debug.ErrLabel("playlist", err)
		}
		return []PlaylistData{}
	}

	return data
}

func (playlist *Exports) Playlist_get(playlistId string) (*PlaylistData, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "get playlist %s...", playlistId)
	}

	rawData, err := os.ReadFile(getPlaylistMetadataFilePath(playlistId))
	if err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabel("playlist", err)
		}
		return nil, err
	}

	data, err := utils.ParseJson[PlaylistData](rawData)
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

	return utils.CreateDirectory(getPlaylistPath(data.Id))
}

func (playlist *Exports) Playlist_update(id string, newData PlaylistData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabel("playlist", "updating playlist...")
	}

	if err := playlist.ensureDatabaseOpen(); err != nil {
		return err
	}

	mergedData := PlaylistData{}
	err := playlist.database.Update(id, func(oldRawData string) (string, error) {
		data, err := utils.ParseJsonString[PlaylistData](oldRawData)
		if err != nil {
			return "", err
		}

		mergePlaylistData(&data, newData)

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
