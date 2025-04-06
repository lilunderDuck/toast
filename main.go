package main

import (
	"burned-toast/backend"
	"burned-toast/backend/dynamic"
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/internals"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

// This app's assets and stuff.
// Make sure to change the path if you change the output path in frontend/vite.config,ts
//
//go:embed frontend/out/static
var assets embed.FS

// App icon used in macOS
//
// If you're on windows, just change the build/appicon.png to something else
// and it will work :)
//
// Make sure the appicon.png width and height are the same.
//
//go:embed build/appicon.png
var icon []byte

func main() {
	// Create an instance of the app structure
	app := backend.NewApp()

	// stopChannel := make(chan bool)
	// go dynamic.CreateServer(stopChannel)
	go dynamic.CreateServer()

	// Create application with options
	err := wails.Run(&options.App{
		Title:             "Burned toast",
		Width:             1024,
		Height:            768,
		LogLevel:          logger.ERROR,
		DisableResize:     false,
		Fullscreen:        false,
		Frameless:         false,
		StartHidden:       false,
		HideWindowOnClose: false,
		OnStartup:         app.Startup,
		OnDomReady:        app.DomReady,
		OnBeforeClose:     app.BeforeClose,
		OnShutdown:        app.Shutdown,
		WindowStartState:  options.Normal,
		Bind: []any{
			app,
			&journal.JournalUtils{},
			&journal.JournalGroupUtils{},
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		// Windows platform specific options
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			DisableWindowIcon:    false,
			// DisableFramelessWindowDecorations: false,
			WebviewUserDataPath: internals.Webview2DataPath,
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
				Title:   "Burned toast",
				Message: "",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		panic(err)
	}

	// Clean ups
	// stopChannel <- true
}
