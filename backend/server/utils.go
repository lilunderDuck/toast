package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"toast/backend/utils"
)

func serveStatic(serverInstance *http.ServeMux, path string, whatPath string) {
	// "/{anything...}" -> match anything after "/". The following route will be valid
	//    /any_path
	//    /basically/anything
	//    ...
	serverInstance.HandleFunc(path+"/{anything...}", func(res http.ResponseWriter, req *http.Request) {
		serveFile(res, req, filepath.Join(whatPath, req.PathValue("anything")))
	})
}

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
			responseWithError(res, status, "static", errors.New("not allowed"))
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

type JSON map[string]any

func readRequestInJson(request *http.Request, out any) error {
	return json.NewDecoder(request.Body).Decode(out)
}

func responseInJson(res http.ResponseWriter, status int, jsonData JSON) {
	if status > 400 {
		jsonString, _ := json.Marshal(jsonData)
		http.Error(res, string(jsonString), status)
		return
	}
	json.NewEncoder(res).Encode(jsonData)
	res.Header().Set("Content-Type", "application/json")
}

var thisHasNothingToDo = []string{
	"The server found your request confusing and isn't sure how to proceed.",
	"The error has been gracefully captured in time.",
	"¯\\_(ツ)_/¯",
}

func responseWithError(res http.ResponseWriter, status int, errorName string, errorDetail error) {
	randomMessage := utils.GetRandomElementFromArray(thisHasNothingToDo)
	responseInJson(res, status, JSON{
		"status":  status,
		"details": fmt.Sprintf("[%s] %s. %s", errorName, errorDetail.Error(), randomMessage),
		"from":    "Toast internal",
	})
}
