package server

import (
	// "net/http"
	// "os"
	// "time"
	"net/http"
	internal "toast/backend/internals"
	// "toast/backend/utils"
	// "github.com/gin-gonic/gin"
	// "github.com/wailsapp/mimetype"
)

func createAssetsRoute(server *http.ServeMux) {
	serveStatic(server, "/local-assets", internal.JOURNAL_FOLDER_PATH)
	serveStatic(server, "/global", internal.GLOBAL_ASSETS_FOLDER_PATH)

	server.HandleFunc("/preview", func(res http.ResponseWriter, req *http.Request) {
		requestedFile := req.URL.Query().Get("path")
		// ... maybe I should code a path filter here ...
		// you don't want a random app like this one to randomly access places
		// like System32, AppData, ... right?
		serveFile(res, req, requestedFile)
	})
}
