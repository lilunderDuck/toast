package internals

import (
	"toast/backend/utils"
)

var (
	// The current path where this executable located.
	CURRENT_EXECUTABLE_PATH string = utils.GetCurrentDir()
	// The frontend source code path.
	STATIC_FOLDER_PATH        = utils.JoinPath(CURRENT_EXECUTABLE_PATH, "app")
	DATA_FOLDER_PATH          = utils.JoinPath(CURRENT_EXECUTABLE_PATH, "data")
	GLOBAL_ASSETS_FOLDER_PATH = utils.JoinPath(CURRENT_EXECUTABLE_PATH, "global")

	JOURNAL_FOLDER_PATH    = utils.JoinPath(DATA_FOLDER_PATH, "journals")
	GROUPS_DATA_SAVED_PATH = utils.JoinPath(DATA_FOLDER_PATH, "group")
	EMBED_SAVED_PATH       = utils.JoinPath(DATA_FOLDER_PATH, "embed")
)
