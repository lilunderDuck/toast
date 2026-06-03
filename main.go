package main

import (
	_ "embed"

	"toast/backend"
	"toast/backend/core/internals"
	"toast/backend/debug"
	"toast/backend/server"

	"github.com/wailsapp/wails/v2"
)

//go:embed build/out/appicon.png
var icon []byte

func main() {
	app := backend.New()
	go server.StartServer()

	if debug.DEBUG_MODE {
		debug.InfoLabelf("app", "All internal paths used for saving data and stuff.")
		debug.InfoLabelf("app", "current exe path:\t%s", debug.FormatPath(internals.CURRENT_EXECUTABLE_PATH))
		debug.InfoLabelf("app", "cache folder:\t\t%s", debug.FormatPath(internals.CACHE_FOLDER_PATH))
		debug.InfoLabelf("app", "data folder:\t\t%s", debug.FormatPath(internals.DATA_FOLDER_PATH))

		err := wails.Run(backend.GetAppConfig(icon, app))
		if err != nil {
			debug.FatalLabel("app", err)
		}
	} else {
		wails.Run(backend.GetAppConfig(icon, app))
	}
}
