package playlist

import (
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

func mergePlaylistData(oldData *PlaylistData, newData PlaylistData) {
	if newData.CoverIcon != "" {
		oldData.CoverIcon = newData.CoverIcon
	}

	if newData.Icon != "" {
		oldData.Icon = newData.Icon
	}

	if newData.Name != "" {
		oldData.Name = newData.Name
	}

	if newData.TotalDuration != 0 {
		oldData.TotalDuration = newData.TotalDuration
	}
}

func mergePlaylistTrackData(oldData *PlaylistTrackData, newData PlaylistTrackData) {
	if newData.Artist != "" {
		oldData.Artist = newData.Artist
	}

	if newData.Duration != 0 {
		oldData.Duration = newData.Duration
	}

	if newData.Icon != "" {
		oldData.Icon = newData.Icon
	}

	if newData.Name != "" {
		oldData.Name = newData.Name
	}
}

var (
	playlistRootPath = internals.DATA_FOLDER_PATH + "/collection/playlist"
	playlistsDbPath  = internals.DATA_FOLDER_PATH + "/collection/playlist/all.db"
)

func getPlaylistPath(id string) string {
	return filepath.Join(playlistRootPath, id)
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

func readPlaylistMetadataFile(playlistId string) (PlaylistData, error) {
	return utils.ReadJsonFile[PlaylistData](getPlaylistMetadataFilePath(playlistId))
}

func writePlaylistMetadataFile(playlistId string, data PlaylistData) error {
	return utils.WriteJsonFile(getPlaylistMetadataFilePath(playlistId), data)
}

func writePlaylistEntryFile(playlistId string, data []PlaylistTrackData) error {
	return utils.WriteJsonFile(getPlaylistEntriesFilePath(playlistId), data)
}
