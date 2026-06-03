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
	DATA_FOLDER_PATH     = filepath.Join(CURRENT_EXECUTABLE_PATH, "data")
)
