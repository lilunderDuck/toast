package playlist

import (
	"path/filepath"
	"strings"
	"toast/backend/core/audio"
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
		debug.InfoLabelf("playlist", "updating track from playlist id: %s", id)
	}

	return utils.WriteJsonFile(getPlaylistEntriesFilePath(id), newData)
}

func (playlist *Exports) Playlist_createTrack(id string, option PlaylistCreateTrackOption) PlaylistTrackData {
	if debug.DEBUG_MODE {
		debug.InfoLabelf(
			"playlist", "creating track %s from playlist id: %s",
			debug.FormatWith(debug.COLOR_YELLOW, debug.STYLE_NONE, option.Name),
			id,
		)
	}

	trackIconPath := getTrackIconPath(id, "")

	if option.IconPath != "" {
		// Note: there's 2 seperate string search here
		isInsideThisPlaylistFolder :=
			strings.Contains(option.IconPath, filepath.FromSlash("/playlist/")) &&
				strings.Contains(option.IconPath, id)
		// ...

		if !isInsideThisPlaylistFolder {
			if err := utils.CopyFile(option.IconPath, trackIconPath); err != nil {
				if debug.DEBUG_MODE {
					debug.ErrLabel("playlist", err)
				}
			}
		}

		option.IconPath = filepath.Base(option.IconPath)
	}

	trackPath := getTrackPath(id, "")
	if err := utils.CopyFile(option.TrackPath, trackPath); err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabel("playlist", err)
		}
	}

	option.TrackPath = filepath.Base(option.TrackPath)

	duration, err := audio.GetDuration(getTrackPath(id, option.TrackPath))
	if err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabel("playlist", err)
		}

		duration = 0
	}

	return PlaylistTrackData{
		Name:     option.Name,
		Artist:   option.Artist,
		Icon:     option.IconPath,
		Duration: uint(duration),
		Filename: option.TrackPath,
		Id:       utils.GetRandomIntWithinLength(8),
	}
}
