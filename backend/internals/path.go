package internals

import (
	"path/filepath"
	"toast/backend/utils"
)

var (
	// The current path where this executable located.
	//
	// To simplify explaination, let's call the current execuable path -> "~/"
	CURRENT_EXECUTABLE_PATH string = utils.GetCurrentDir()
	// This is where all of the built frontend stuff is stored, which is "~/app".
	APP_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "app")
	// All of generic cache data is stored, which is "~/cache".
	CACHE_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "cache")
	// All of generic important saved data is stored, which is "~/data"
	DATA_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "data")
	// [preserved for future use?]
	GLOBAL_ASSETS_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "global")
	// The path where all of the app resource files are stored, which is "~/resource"
	RESOURCE_FOLDER_PATH = filepath.Join(CURRENT_EXECUTABLE_PATH, "resource")
)
