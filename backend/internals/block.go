package internals

import (
	"fmt"
	"path/filepath"
	"toast/backend/utils"
)

var (
	// The path where all of your local embed are stored, which is "~/embed".
	//
	// Yes, you can embed your own web page, that's why it's called "local embed".
	EMBED_SAVED_PATH    = filepath.Join(CURRENT_EXECUTABLE_PATH, "embed")
	GALLERY_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "gallery")
)

func GalleryPath(galleryId int) string {
	return filepath.Join(CURRENT_EXECUTABLE_PATH, "gallery", utils.ToString(galleryId))
}

func GalleryDataMetadataPath(galleryId int) string {
	return filepath.Join(GalleryPath(galleryId), "meta.dat")
}

func AudioPath(groupId int) string {
	return filepath.Join(CURRENT_EXECUTABLE_PATH, "audio", utils.ToString(groupId))
}

func AudioPlaylistPath(playlistId int) string {
	return filepath.Join(CURRENT_EXECUTABLE_PATH, "playlist", utils.ToString(playlistId))
}

func AudioPlaylistMetadataPath(playlistId int) string {
	return filepath.Join(DATA_FOLDER_PATH, fmt.Sprintf("playlist-%d.dat", playlistId))
}

func MediaPath(groupId int) string {
	return filepath.Join(CURRENT_EXECUTABLE_PATH, "media", utils.ToString(groupId))
}
