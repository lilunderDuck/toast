package internals

import (
	"toast/backend/utils"
)

var (
	// The current path where this executable located.
	//
	// To simplify explaination, let's call the current execuable path -> "~/"
	CURRENT_EXECUTABLE_PATH string = utils.GetCurrentDir()
	// This is where all of the built frontend stuff is stored, which is "~/app".
	APP_FOLDER_PATH = utils.JoinPath(CURRENT_EXECUTABLE_PATH, "app")
	// All of generic cache data is stored, which is "~/cache".
	CACHE_FOLDER_PATH = utils.JoinPath(CURRENT_EXECUTABLE_PATH, "cache")
	// [preserved for future use?]
	GLOBAL_ASSETS_FOLDER_PATH = utils.JoinPath(CURRENT_EXECUTABLE_PATH, "global")
	// The path where all of your local embed are stored, which is "~/embed".
	//
	// Yes, you can embed your own web page, that's why it's called "local embed".
	EMBED_SAVED_PATH = utils.JoinPath(CURRENT_EXECUTABLE_PATH, "embed")
)
