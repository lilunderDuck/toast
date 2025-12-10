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
			debug.Log("Handle request:", "path", r.URL.Path)
		})

		debug.Log("One server comin' right up")
	}

	err := http.ListenAndServe(":8000", server)
	if debug.DEBUG_MODE {
		if err != nil {
			println(err) // don't make it crash on dev mode
		}
	}
}
