package playlist

import (
	"math"
	"toast/backend/core/audio"
	"toast/backend/debug"
)

func (playlist *Exports) ResyncDuration(playlistId int) (*UpdatedPlaylist, error) {
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

	return &UpdatedPlaylist{
		Metadata: *metadata,
		Tracks:   entries,
	}, nil
}

func (playlist *Exports) ResyncAllPlaylists() error {
	return nil
}

func (playlist *Exports) DontCutOffMyTrack(playlistId int) error {
	return nil
}
