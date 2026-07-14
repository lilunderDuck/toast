package playlist

import (
	"math"
	"os"
	"toast/backend/core/audio"
	"toast/backend/debug"
	// "toast/backend/utils"
)

func (playlist *Exports) Playlist_resyncTrackDuration(playlistId string) (*UpdatedPlaylist, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "start resyncing all tracks duration...")
	}

	entries, err := playlist.Playlist_getAllTrack(playlistId)
	if err != nil {
		return nil, err
	}

	var totalDuration uint = 0
	for i := range entries {
		duration, err := audio.GetDuration(getTrackPath(playlistId, entries[i].Filename))
		if err != nil {
			if debug.DEBUG_MODE {
				debug.ErrLabelf("playlist", "failed to get %s duration, skipping...", debug.FormatFilename(entries[i].Filename))
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
				debug.FormatNumbers(durationRounded),
			)
		}
	}

	metadata, err := playlist.Playlist_get(playlistId)
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

	if err := playlist.Playlist_update(playlistId, *metadata); err != nil {
		return nil, err
	}

	if err := writePlaylistEntryFile(playlistId, entries); err != nil {
		return nil, err
	}

	return &UpdatedPlaylist{
		Metadata: *metadata,
		Tracks:   entries,
	}, nil
}

func (playlist *Exports) Playlist_resyncAll() ([]PlaylistData, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabel("playlist", "Start updating existing playlist metadata")
	}

	playlists := []PlaylistData{}

	allPlaylistPath, err := os.ReadDir(playlistRootPath)
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
				debug.WarnLabelf("playlist", "%s is not a directory, skipping...", debug.FormatPath(playlistId))
			}
			continue
		}

		metadata, err := readPlaylistMetadataFile(playlistId)
		if err != nil {
			if debug.DEBUG_MODE {
				debug.ErrLabelf("playlist", "failed to get playlist metadata, skipping...")
				debug.ErrLabel("playlist", err)
			}
			continue
		}

		if debug.DEBUG_MODE {
			debug.InfoLabelf("playlist", "data dump: %#v", metadata)
		}

		if metadata.Id != playlistId {
			if debug.DEBUG_MODE {
				debug.WarnLabelf("playlist", "found mismatched playlist id %s, setting it back to %s", debug.FormatFilename(metadata.Id), debug.FormatFilename(playlistId))
			}
			metadata.Id = playlistId
		}

		// if playlist.database.Has(playlistId) {
		// 	playlist.Playlist_update(playlistId, metadata)
		// } else {
		// 	playlist.database.Set(playlistId, utils.StringifyJson(metadata))
		// }
	}

	return playlists, nil
}

func (playlist *Exports) DontCutOffMyTrack(playlistId string) error {
	return nil
}
