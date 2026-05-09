// Provides a set of utility functions for handling HTTP requests,
// serving assets files, and managing JSON responses and errors.
package server

import (
	"net/http"
	"toast/backend/debug"
)

// Start the local journal assets server.
//
// Make sure to run this on another goroutine, otherwise it will block everything, like this.
//
//	go StartServer()
func StartServer() {
	server := http.NewServeMux()

	createAssetsRoute(server)
	// createApiRoute(server)
	if debug.DEBUG_MODE {
		server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			debug.InfoLabelf("assets", "Handle request: %s", debug.FormatPath(r.URL.Path))
		})

		debug.InfoLabel("assets", "One server comin' right up")
	}

	err := http.ListenAndServe(":8000", server)
	if debug.DEBUG_MODE {
		if err != nil {
			debug.WarnLabelf("assets", "Server already been opened.\n%s", err.Error())
		}
	}
}
