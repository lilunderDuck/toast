package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"toast/backend/utils"
)

// A type alias for representing *any* JSON data.
type JSON map[string]any

// Serves files from a given local directory (`whatPath`) at a specified
// URL path (`path`) on the server. It handles any sub-paths under the main path.
//
// For example, if `path` is `/embed` and `whatPath` is `/var/www/embeds`,
// a request to `/embed/my-file.html` will serve the file at `/var/www/embeds/my-file.html`.
func serveStatic(serverInstance *http.ServeMux, path string, whatPath string) {
	// "/{anything...}" -> match anything after "/". The following route will be valid
	// 	 /any_path
	// 	 /basically/anything
	// 	 ...
	serverInstance.HandleFunc(path+"/{anything...}", func(res http.ResponseWriter, req *http.Request) {
		serveFile(res, req, filepath.Join(whatPath, req.PathValue("anything")))
	})
}

// Serves files from a given local directory, but with an added
// `filter` function to control access.
//
// The filter function takes a file path and
// returns an HTTP status code. If the status is `http.StatusForbidden`, the request
// is denied and an error is returned to the client.
//
// The filter function can return any int, but it's better to return `http.StatusAccepted`
// for better readability.
func serveStaticWithFilter(
	serverInstance *http.ServeMux,
	path string,
	whatPath string,
	filter func(path string) int,
) {
	serverInstance.HandleFunc(path+"/{anything...}", func(res http.ResponseWriter, req *http.Request) {
		path := req.PathValue("anything")
		status := filter(path)
		if status == http.StatusForbidden {
			responseWithError(res, status, "static", fmt.Errorf("not allowed to serve %s\n, if this is not intentional, check your filter function", path))
			return
		}

		serveFile(res, req, filepath.Join(whatPath, path))
	})
}

// Serving file in a very efficent way. (which means it can deals with range request too).
//
// It also sets Access-Control-Allow-Origin to response to bypass CORS related stuff,
// because CORS is a pain in the hell.
func serveFile(res http.ResponseWriter, req *http.Request, filePath string) {
	println("Serving file:", filePath)
	res.Header().Set("Access-Control-Allow-Origin", "*")
	http.ServeFile(res, req, filePath)
}

// Reads a JSON request body into the provided Go variable `out`.
// It returns an error if the decoding fails.
func readRequestInJson(request *http.Request, out any) error {
	return json.NewDecoder(request.Body).Decode(out)
}

// Sends a JSON response to the client with the specified HTTP status code.
func responseInJson(res http.ResponseWriter, status int, jsonData JSON) {
	if status >= 400 {
		jsonString, _ := json.Marshal(jsonData)
		http.Error(res, string(jsonString), status)
		return
	}
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(jsonData)
}

// Extra confusing message to confuse you, maybe
var thisHasNothingToDo = []string{
	"The server found your request confusing and isn't sure how to proceed.",
	"(ㆆ _ ㆆ)",
	"¯\\_(ツ)_/¯",
	"( 0 _ 0 )",
	"(-_-)",
	"(≧︿≦)",
	"¯\\(°_o)/¯",
	"༼ つ ╹ ╹ ༽つ",
}

// Formats an error message into a JSON response with a specific HTTP status code.
func responseWithError(res http.ResponseWriter, status int, errorName string, errorDetail error) {
	randomMessage := utils.GetRandomElementFromArray(thisHasNothingToDo)
	responseInJson(res, status, JSON{
		"status":  status,
		"name":    errorName,
		"details": fmt.Sprintf("%s. %s", errorDetail.Error(), randomMessage),
	})
}
