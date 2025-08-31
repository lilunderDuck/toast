package server

import (
	"net/http"
	"toast/backend/internals"
)

func createAssetsRoute(server *http.ServeMux) {
	serveStatic(server, "/local-assets", internals.GROUP_FOLDER_PATH)
	serveStatic(server, "/global", internals.GLOBAL_ASSETS_FOLDER_PATH)
	serveStatic(server, "/embed", internals.EMBED_SAVED_PATH)

	server.HandleFunc("/preview", func(res http.ResponseWriter, req *http.Request) {
		requestedFile := req.URL.Query().Get("path")
		// ... maybe I should code a path filter here ...
		// you don't want a random app like this one to randomly access places
		// like System32, AppData, ... right?
		serveFile(res, req, requestedFile)
	})
}
