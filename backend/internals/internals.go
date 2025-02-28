package internals

import (
	"burned-toast/backend/utils"
)

// Stores the path to the folder where the app is running.
//
// Basically the app's home address.
var AppCurrentDirectory string = utils.GetCurrentDir()

// Stores the path to the folder where all the app's data is kept.
var DataFolderPath string = utils.JoinPath(AppCurrentDirectory, "data")

// Stores the path to the folder where the app keeps temporary data.
var CacheFolderPath string = utils.JoinPath(DataFolderPath, "cache")

// Stores the path to the folder where the web edge webview2 data is kept.
var Webview2DataPath string = utils.JoinPath(DataFolderPath, "edgewebvieeew")

// Stores the path to the folder where all the app's resources are kept.
var ResourcesFolderPath string = utils.JoinPath(AppCurrentDirectory, "resource")
