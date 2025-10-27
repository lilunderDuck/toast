package backend

import (
	"os"
	"toast/backend/features/editor"
	"toast/backend/features/group"

	"toast/backend/features/editor/gallery"
	"toast/backend/features/editor/playlist"

	"toast/backend/features/journal"
	"toast/backend/features/misc"
	"toast/backend/internals"

	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

// Everything related to wails's config basically.
func GetAppConfig(icon []byte, appInstance *App) *options.App {
	const WINDOW_TITLE = "Toast making machine"

	binding := []any{
		appInstance,
		&journal.Exports{},
		&editor.Exports{},
		&misc.Exports{},
		&group.Exports{},
		// ...
		&playlist.Exports{},
		&gallery.Exports{},
	}

	return &options.App{
		Title:     WINDOW_TITLE,
		Frameless: true,
		Width:     1000,
		Height:    768,
		AssetServer: &assetserver.Options{
			Assets: os.DirFS(internals.RESOURCE_FOLDER_PATH),
			// Well, my intrusive thoughts *thought* that it'd be better to merge everything into
			// one single server, instead of ones for the assets, and other for journal and stuff.
			//
			// Holy hell, this hurts my brain. The video serving were extremely slow for some reason.
			// It takes a lot of time to load just a 20 mins video. I even switch to http.ServeMux instead
			// of gin-gonic. (which is okay I guess, I don't need something crazy like validation, auth, ...)
			//
			// The good thing is it works now (thank god). Just starts another server and
			// everything will be fine.
			//
			// And you know why the app uses 2 servers for handling assets.
			// Handler: server.StartServer(), // yeet this out
		},
		OnStartup:        appInstance.startup,
		OnDomReady:       appInstance.domReady,
		OnBeforeClose:    appInstance.beforeClose,
		OnShutdown:       appInstance.shutdown,
		WindowStartState: options.Normal,
		Bind:             binding,
		// Windows platform specific options
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			WebviewUserDataPath:  internals.CURRENT_EXECUTABLE_PATH,
		},
		// Mac platform specific options
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
				HideTitle:                  false,
				HideTitleBar:               false,
				FullSizeContent:            false,
				UseToolbar:                 true,
				HideToolbarSeparator:       true,
			},
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   WINDOW_TITLE,
				Message: "",
				Icon:    icon,
			},
		},
	}
}
