// Provides a set of utility functions for handling HTTP requests,
// serving assets files, and managing JSON responses and errors.
package server

import (
	"net/http"
	"strings"
	"toast/backend/core/internals"
	"toast/backend/debug"
)

var allowedToServeMap = map[string]uint8{
	"data":  http.StatusAccepted,
	"cache": http.StatusAccepted,
}

// Start the local journal assets server.
//
// Make sure to run this on another goroutine, otherwise it will block everything, like this.
//
//	go StartServer()
func StartServer() {
	if debug.DEBUG_MODE {
		debug.InfoLabel("assets", "Dynamic assets server is starting...")
	}

	server := http.NewServeMux()

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

	// createApiRoute(server)
	if debug.DEBUG_MODE {
		server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			debug.InfoLabelf("assets", "Handle request: %s", debug.FormatPath(r.URL.Path))
		})

		debug.InfoLabel("assets", "One server comin' right up")
	}

	err := http.ListenAndServe(":34116", server)
	if debug.DEBUG_MODE {
		if err != nil {
			debug.WarnLabelf("assets", "Server already been opened.\n%s", err.Error())
		}
	}
}
