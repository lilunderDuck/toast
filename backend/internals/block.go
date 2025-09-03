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
)

func GalleryPath(groupId int, galleryId int) string {
	return filepath.Join(GALLERY_FOLDER_PATH, utils.ToString(groupId), utils.ToString(galleryId))
}

func GalleryDataFilePath(groupId int, galleryId int) string {
	return filepath.Join(GalleryPath(groupId, galleryId), "meta.dat")
}
