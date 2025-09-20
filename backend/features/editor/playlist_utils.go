package editor

import (
	"fmt"
	"os"
	"toast/backend/internals"
	"toast/backend/utils"
)

func playlistPath(playlistId int) string {
	return fmt.Sprintf(`%s/playlist/%d`, internals.DATA_FOLDER_PATH, playlistId)
}

func playlistMetaPath(playlistId int) string {
	return fmt.Sprintf(`%s/playlist/%d/meta.dat`, internals.DATA_FOLDER_PATH, playlistId)
}

func readPlaylistData(playlistId int) (*PlaylistMetadata, error) {
	return utils.BSON_ReadFile[PlaylistMetadata](playlistMetaPath(playlistId))
}

func writePlaylistData(playlistId int, data *PlaylistMetadata) error {
	return utils.BSON_WriteFile(playlistMetaPath(playlistId), data)
}

func deletePlaylistData(playlistId int) error {
	return os.Remove(playlistPath(playlistId))
}
