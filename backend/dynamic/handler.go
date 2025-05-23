package dynamic

import (
	"burned-toast/backend/debug"
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"

	// "fmt"
	"net/http"
	"strings"
)

const ROUTE string = "/dynamic/"

func CreateServer() {
	debug.Info("[dynamic assets] starting assets server")
	http.HandleFunc(ROUTE, dealWithAssets)
	http.ListenAndServe(":8080", nil)
}

func dealWithAssets(w http.ResponseWriter, r *http.Request) {
	method := r.Method
	debug.Infof("[dynamic assets] %s %s", method, r.URL.Path)
	addHeader(w, "Access-Control-Allow-Origin", "*")

	requestedFile := strings.TrimPrefix(r.URL.Path, ROUTE)
	debug.Info("[dynamic assets] requested file will be:", "file", requestedFile)

	// we can't simply read the file from the disk
	// if we have like a huge video like 1 - 2 GB for example,
	// it will crash the app.
	http.ServeFile(w, r, utils.JoinPath(internals.DataFolderPath, requestedFile))
}
