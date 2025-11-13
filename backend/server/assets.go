package server

import (
	"net/http"
	"strings"
	"toast/backend/internals"
)

var allowedToServeMap = map[string]uint8{
	"data":  0,
	"media": 0,
}

func createAssetsRoute(server *http.ServeMux) {
	serveStaticWithFilter(server, "/local-assets", internals.CURRENT_EXECUTABLE_PATH, func(path string) int {
		firstFolderName := strings.SplitAfterN(path, "/", 2)[0]
		firstFolderName = strings.Replace(firstFolderName, "/", "", 1)
		_, ok := allowedToServeMap[firstFolderName]
		if !ok {
			return http.StatusForbidden
		}
		return http.StatusAccepted
	})

	server.HandleFunc("/preview", func(res http.ResponseWriter, req *http.Request) {
		requestedFile := req.URL.Query().Get("path")
		// ... maybe I should code a path filter here ...
		// you don't want a random app like this one to randomly access places
		// like System32, AppData, ... right?
		serveFile(res, req, requestedFile)
	})
}
