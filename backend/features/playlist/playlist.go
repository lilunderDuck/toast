package playlist

import (
	"os"
	"strconv"
	"toast/backend/debug"
	"toast/backend/utils"
)

func (playlist *Exports) GetAllPlaylistsData() []PlaylistData {
	data, err := utils.ParseJsonString[[]PlaylistData](playlist.database.GetAll())
	if err != nil {
		debug.ErrLabel("playlist", err)
		return []PlaylistData{}
	}
	return data
}

func (playlist *Exports) GetPlaylistData(playlistId int) (*PlaylistData, error) {
	rawData, err := os.ReadFile(getPlaylistMetadataFilePath(playlistId))
	if err != nil {
		debug.ErrLabel("playlist", err)
		return nil, err
	}

	data, err := utils.ParseJson[PlaylistData](rawData)
	if debug.DEBUG_MODE {
		if err != nil {
			debug.ErrLabel("playlist", err)
		}
	}

	return &data, err
}

func (playlist *Exports) CreatePlaylistData(data PlaylistData) error {
	err := playlist.database.Set(strconv.Itoa(data.Id), utils.StringifyJson(data))
	if err != nil {
		return err
	}

	return utils.CreateDirectory(getPlaylistPath(data.Id))
}

func (playlist *Exports) UpdatePlaylistData(id int, newData PlaylistData) error {
	if debug.DEBUG_MODE {
		debug.LogLabel("playlist", "updating playlist data")
	}

	mergedData := PlaylistData{}
	shouldCloseAutomatically := false
	if playlist.database == nil {
		if debug.DEBUG_MODE {
			debug.WarnLabelf("playlist", "database already closed, attempting to open to update data...")
		}
		playlist.InitPlaylists()
		shouldCloseAutomatically = true
	}

	if debug.DEBUG_MODE {
		debug.LogLabel("playlist", "updating playlist data from database...")
	}

	err := playlist.database.Update(strconv.Itoa(id), func(oldRawData string) (string, error) {
		data, err := utils.ParseJsonString[PlaylistData](oldRawData)
		if err != nil {
			return "", err
		}

		if newData.CoverIcon != "" {
			data.CoverIcon = newData.CoverIcon
		}

		if newData.Icon != "" {
			data.Icon = newData.Icon
		}

		if newData.Name != "" {
			data.Name = newData.Name
		}

		if newData.TotalDuration != 0 {
			data.TotalDuration = newData.TotalDuration
		}

		mergedData = data
		return utils.StringifyJson(data), nil
	})

	if err != nil {
		return err
	}

	if debug.DEBUG_MODE {
		debug.LogLabel("playlist", "updating playlist data from database...")
	}

	err = utils.WriteJsonFile(getPlaylistMetadataFilePath(id), mergedData)
	if err != nil {
		return err
	}

	if shouldCloseAutomatically {
		playlist.CleanupPlaylists()
	}

	return nil
}
