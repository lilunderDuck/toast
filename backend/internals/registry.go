package internals

import (
	"path/filepath"
	"strconv"
)

type playlistPathRegistry struct {
	Root string
}

var PlaylistPathRegistry = playlistPathRegistry{
	Root: DATA_FOLDER_PATH + "/collection/playlist",
}

func (reg *playlistPathRegistry) TracksData(id int) string {
	return filepath.Join(reg.PlaylistPath(id), "data/entries.json")
}

func (reg *playlistPathRegistry) TrackPath(id int, fileName string) string {
	return filepath.Join(reg.PlaylistPath(id), "tracks", fileName)
}

func (reg *playlistPathRegistry) IconPath(id int, fileName string) string {
	return filepath.Join(reg.PlaylistPath(id), "icons", fileName)
}

func (reg *playlistPathRegistry) PlaylistPath(id int) string {
	return filepath.Join(reg.Root, strconv.Itoa(id))
}
