package internals

import (
	"path/filepath"
	"toast/backend/utils"
)

var (
	// The path where all of your local embed are stored, which is "~/embed".
	//
	// Yes, you can embed your own web page, that's why it's called "local embed".
	EMBED_SAVED_PATH    = filepath.Join(CURRENT_EXECUTABLE_PATH, "embed")
	GALLERY_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "gallery")
	MEDIA_FOLDER_PATH   = filepath.Join(CURRENT_EXECUTABLE_PATH, "media")
)

func GalleryPath(galleryId int) string {
	return filepath.Join(GALLERY_FOLDER_PATH, utils.ToString(galleryId))
}

func GalleryDataFilePath(galleryId int) string {
	return filepath.Join(GalleryPath(galleryId), "meta.dat")
}

func MediaPath(groupId int) string {
	return filepath.Join(MEDIA_FOLDER_PATH, utils.ToString(groupId))
}
