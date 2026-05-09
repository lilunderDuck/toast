package playlist

import (
	"path/filepath"
	"strconv"
	"toast/backend/core/collection"
	"toast/backend/internals"
)

var pathRegistry = collection.CollectionPathRegistry{
	Root:     internals.DATA_FOLDER_PATH + "/collection/playlist",
	Database: internals.DATA_FOLDER_PATH + "/collection/playlist/all.db",
}

func getPlaylistPath(id int) string {
	return filepath.Join(pathRegistry.Root, strconv.Itoa(id))
}

func getPlaylistMetadataFilePath(id int) string {
	return filepath.Join(getPlaylistPath(id), "meta.json")
}

func getPlaylistEntriesFilePath(id int) string {
	return filepath.Join(getPlaylistPath(id), "entries.json")
}

func getTrackPath(id int, fileName string) string {
	return filepath.Join(getPlaylistPath(id), "tracks", fileName)
}

func getTrackIconPath(id int, fileName string) string {
	return filepath.Join(getPlaylistPath(id), "icons", fileName)
}
