package internals

import (
	"burned-toast/backend/utils"
)

// Stores the path to the folder where the app is running.
//
// Basically the app's home address.
var AppCurrentDirectory string = utils.GetCurrentDir()

var (
	// Stores the path to the folder where all the app's data is kept.
	DataFolderPath = utils.JoinPath(AppCurrentDirectory, "data")
	// Stores the path to the folder where the app keeps temporary data.
	CacheFolderPath = utils.JoinPath(DataFolderPath, "cache")
	// Stores the path to the folder where all the app's resources are kept.
	ResourcesFolderPath = utils.JoinPath(AppCurrentDirectory, "resource")
	// Also a folder containing the app's resources but it's for static content, eg. the web app.
	StaticFolderPath = utils.JoinPath(AppCurrentDirectory, "static")
)

// internals file and stuff
var (
	FileDialogLibPath = utils.JoinPath(ResourcesFolderPath, "antiBrainrot.dll")
)
