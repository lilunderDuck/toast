package internals

import (
	"path/filepath"
	"toast/backend/utils"
)

var (
	// The current path where this executable is located.
	CURRENT_EXECUTABLE_PATH string = utils.GetCurrentDir()
	// All of generic cache data is stored, which is "~/cache".
	CACHE_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "cache")
	// The path where all of the app resource files are stored, which is "~/resource"
	RESOURCE_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "resource")
)

// The path where all of journal groups data are stored, which is "~/data/groups".
var GROUPS_DATA_PATH string = filepath.Join(DATA_FOLDER_PATH, "groups")

var (
	// All of generic important saved data is stored, which is "~/data"
	DATA_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "data")
	// All of the media only (video, audio, documents, ...) files are stored, which is "~/media"
	MEDIA_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "media")
	// The path where all of your local embed are stored, which is "~/embed".
	EMBED_SAVED_PATH    = filepath.Join(CURRENT_EXECUTABLE_PATH, "embed")
	GALLERY_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "gallery")
)
