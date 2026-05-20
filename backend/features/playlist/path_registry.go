package playlist

import (
	"path/filepath"
	"toast/backend/core/collection"
	"toast/backend/internals"
)

var pathRegistry = collection.CollectionPathRegistry{
	Root:     internals.DATA_FOLDER_PATH + "/collection/playlist",
	Database: internals.DATA_FOLDER_PATH + "/collection/playlist/all.db",
}

func getPlaylistPath(id string) string {
	return filepath.Join(pathRegistry.Root, id)
}

func getPlaylistMetadataFilePath(id string) string {
	return filepath.Join(getPlaylistPath(id), "meta.json")
}

func getPlaylistEntriesFilePath(id string) string {
	return filepath.Join(getPlaylistPath(id), "entries.json")
}

func getTrackPath(id string, fileName string) string {
	return filepath.Join(getPlaylistPath(id), "tracks", fileName)
}

func getTrackIconPath(id string, fileName string) string {
	return filepath.Join(getPlaylistPath(id), "icons", fileName)
}
