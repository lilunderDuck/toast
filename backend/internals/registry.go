package internals

import (
	"path/filepath"
	"strconv"
)

var playlistRootDir = DATA_FOLDER_PATH + "/playlist"

type playlistPathRegistry struct {
	Root string
}

var PlaylistPathRegistry = playlistPathRegistry{
	Root: DATA_FOLDER_PATH + "/playlist",
}

func (reg *playlistPathRegistry) TrackPath(id int, fileName string) string {
	return filepath.Join(reg.Root, strconv.Itoa(id), "tracks", fileName)
}

func (reg *playlistPathRegistry) IconPath(id int, fileName string) string {
	return filepath.Join(reg.Root, strconv.Itoa(id), "icons", fileName)
}

func (reg *playlistPathRegistry) PlaylistPath(id int) string {
	return filepath.Join(reg.Root, strconv.Itoa(id))
}
