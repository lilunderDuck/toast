package main

import (
	_ "embed"
	"log"

	"toast/backend"
	"toast/backend/server"

	"github.com/wailsapp/wails/v2"
)

//go:embed build/out/appicon.png
var icon []byte

func main() {
	app := backend.New()
	go server.StartServer()

	err := wails.Run(backend.GetAppConfig(icon, app))
	if err != nil {
		log.Fatal(err)
	}
}
