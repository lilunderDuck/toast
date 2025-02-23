package main

import (
	"burned-toast/backend"
	"burned-toast/backend/internals"
	"embed"
	"log"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/out/static
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	// Create an instance of the app structure
	app := backend.NewApp()

	// oh great, how sketchy.
	// just to make the damn app load the image from data folder
	// and currently there's no way to do that without messing with vite or something
	// and yeah, I don't know how to serve static file tho, can't really find a solution
	// this is wonderfully insecure, I know, don't ask me.
	os.Setenv("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--disable-web-security")

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Burned toast",
		Width:  1024,
		Height: 768,
		// MinWidth:          1024,
		// MinHeight:         768,
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
		},
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: backend.NewFileLoader(),
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
		log.Fatal(err)
	}
}
