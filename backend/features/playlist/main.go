package playlist

import (
	"toast/backend/db"
)

type Exports struct {
	database *db.Instance
}

func (playlist *Exports) InitPlaylists() {
	instance, _ := db.Open(pathRegistry.Database)
	playlist.database = instance
}

func (playlist *Exports) CleanupPlaylists() {
	db.Close(pathRegistry.Database)
	playlist.database = nil
}
