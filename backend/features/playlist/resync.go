package playlist

import (
	"math"
	"os"
	"toast/backend/core/audio"
	"toast/backend/debug"
	"toast/backend/utils"
)

func (playlist *Exports) ResyncDuration(playlistId string) (*UpdatedPlaylist, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "start resyncing all tracks duration...")
	}

	entries, err := playlist.GetAllPlaylistTrack(playlistId)
	if err != nil {
		return nil, err
	}

	var totalDuration uint = 0
	for i := range entries {
		duration, err := audio.GetDuration(getTrackPath(playlistId, entries[i].Filename))
		if err != nil {
			if debug.DEBUG_MODE {
				debug.ErrLabelf(
					"playlist",
					"failed to get %s duration, skipping...",
					debug.FormatFilename(entries[i].Filename),
				)
			}
			continue
		}

		durationRounded := uint(math.Round(duration))
		entries[i].Duration = durationRounded
		totalDuration += durationRounded
		if debug.DEBUG_MODE {
			debug.InfoLabelf(
				"playlist",
				"synced %s duration: %s seconds in total",
				debug.FormatFilename(entries[i].Filename),
				debug.FormatNumbers(totalDuration),
			)
		}
	}

	metadata, err := playlist.GetPlaylistData(playlistId)
	if err != nil {
		return nil, err
	}

	metadata.TotalDuration = totalDuration
	if debug.DEBUG_MODE {
		debug.InfoLabelf(
			"playlist",
			"updated playlist total duration: %s seconds in total",
			debug.FormatNumbers(totalDuration),
		)
		debug.InfoLabelf("playlist", "done!")
	}

	playlist.UpdatePlaylistData(metadata.Id, *metadata)

	return &UpdatedPlaylist{
		Metadata: *metadata,
		Tracks:   entries,
	}, nil
}

func (playlist *Exports) ResyncAllPlaylists() ([]PlaylistData, error) {
	if playlist.database == nil {
		playlist.InitPlaylists()
	}

	playlists := playlist.GetAllPlaylistsData()

	if debug.DEBUG_MODE {
		debug.InfoLabel("playlist", "Start updating existing playlist metadata")
	}

	allPlaylistPath, err := os.ReadDir(pathRegistry.Root)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabel("playlist", err)
		}
		return playlists, err
	}

	for _, path := range allPlaylistPath {
		playlistId := path.Name()
		if !path.IsDir() {
			if debug.DEBUG_MODE {
				debug.InfoLabelf("playlist", "%s is not a directory, skipping...", debug.FormatPath(playlistId))
			}
			continue
		}

		if debug.DEBUG_MODE {
			debug.InfoLabelf("playlist", "detected: %s", debug.FormatPath(playlistId))
		}

		metadata, err := utils.ReadJsonFile[PlaylistData](getPlaylistMetadataFilePath(playlistId))
		if err != nil {
			if debug.DEBUG_MODE {
				debug.ErrLabelf("playlist", "failed to get playlist metadata, skipping...")
				debug.ErrLabel("playlist", err)
			}
			continue
		}

		playlists = append(playlists, metadata)
		if !playlist.database.Has(playlistId) {
			playlist.database.Update(playlistId, func(oldData string) (string, error) {
				err := playlist.UpdatePlaylistData(playlistId, metadata)
				return "", err
			})
		} else {
			playlist.database.Set(playlistId, utils.StringifyJson(metadata))
		}
	}

	return playlists, nil
}

func (playlist *Exports) DontCutOffMyTrack(playlistId string) error {
	return nil
}
