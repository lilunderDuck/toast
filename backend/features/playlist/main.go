package playlist

import (
	"toast/backend/internals"
	"toast/backend/utils"

	"github.com/sonyarouje/simdb"
)

type Exports struct {
}

var allPlaylistDb *simdb.Driver = nil
var playlistDbs = map[int]*simdb.Driver{}

func (*Exports) InitPlaylist() {
	driver, err := simdb.New(internals.PlaylistPathRegistry.Root)
	if err != nil {
		panic(err)
	}

	allPlaylistDb = driver
}

func (*Exports) CleanupPlaylist() {
	if allPlaylistDb != nil {
		allPlaylistDb = nil
	}
}

func (*Exports) InitPlaylistWithId(playlistId int) {
	playlistPath := internals.PlaylistPathRegistry.PlaylistPath(playlistId)
	utils.CreateDirectory(playlistPath)
	driver, err := simdb.New(playlistPath)
	if err != nil {
		panic(err)
	}

	playlistDbs[playlistId] = driver
}
