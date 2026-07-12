package main

import (
	"embed"
	_ "embed"

	"toast/backend"
	"toast/backend/core/internals"
	"toast/backend/debug"
	"toast/backend/server"

	"github.com/wailsapp/wails/v2"
)

//go:embed build/out/appicon.png
var icon []byte

//go:embed all:build/dist/app
var assets embed.FS

func main() {
	app := backend.New()
	go server.StartServer()

	config := backend.GetAppConfig(icon, app, assets)

	if debug.DEBUG_MODE {
		debug.InfoLabelf("app", "All internal paths used for saving data and stuff.")
		debug.InfoLabelf("app", "current exe path:\t%s", debug.FormatPath(internals.CURRENT_EXECUTABLE_PATH))
		debug.InfoLabelf("app", "cache folder:\t\t%s", debug.FormatPath(internals.CACHE_FOLDER_PATH))
		debug.InfoLabelf("app", "data folder:\t\t%s", debug.FormatPath(internals.DATA_FOLDER_PATH))

		err := wails.Run(config)
		if err != nil {
			debug.FatalLabel("app", err.Error())
		}
		return
	}

	wails.Run(config)
}
