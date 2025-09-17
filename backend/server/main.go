// Provides a set of utility functions for handling HTTP requests,
// serving assets files, and managing JSON responses and errors.
package server

import (
	"net/http"
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
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		println("Handle request:", r.URL.Path)
	})

	println("One server comin' right up")
	err := http.ListenAndServe(":8000", server)
	if err != nil {
		println(err)
	}
}
