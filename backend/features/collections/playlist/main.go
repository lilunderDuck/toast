package playlist

import (
	"errors"
	"toast/backend/db"
	"toast/backend/debug"
)

type Exports struct {
	database *db.Instance
}

func (playlist *Exports) Playlist_init() {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "init")
	}
	instance, _ := db.Open(playlistsDbPath)
	playlist.database = instance
}

func (playlist *Exports) Playlist_cleanup() {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("playlist", "cleaning up...")
	}
	db.Close(playlistsDbPath)
	playlist.database = nil
}

func (e *Exports) ensureDatabaseOpen() error {
	if e.database == nil {
		if debug.DEBUG_MODE {
			debug.WarnLabel("playlist", "Database already closed!!! Attempting to re-init...")
		}
		e.Playlist_init()
		if e.database == nil {
			return errors.New("failed to restore database")
		}
	}
	return nil
}
