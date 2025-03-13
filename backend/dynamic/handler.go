package dynamic

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"

	// "fmt"
	"net/http"
	"strings"
)

const ROUTE string = "/dynamic/"

func CreateServer() {
	println("[dynamic]", "Starting server")
	http.HandleFunc(ROUTE, dealWithAssets)
	http.HandleFunc("/upload", moveFile)
	http.ListenAndServe(":8080", nil)
}

func dealWithAssets(w http.ResponseWriter, r *http.Request) {
	method := r.Method
	println("[dynamic]", method, r.URL.Path)
	addHeader(w, "Access-Control-Allow-Origin", "*")

	requestedFile := strings.TrimPrefix(r.URL.Path, ROUTE)
	println("[dynamic]", "requested file will be", requestedFile)
	http.ServeFile(w, r, utils.JoinPath(internals.DataFolderPath, requestedFile))
}

func moveFile(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	println("[dynamic]", r.Method, r.URL.Path)
	addHeader(w, "Access-Control-Allow-Origin", "*")
	addHeader(w, "Access-Control-Allow-Methods", "POST")

	requestedFile := query.Get("requestedFile")
	if requestedFile == "" {
		sendStatusCode(w, http.StatusBadRequest, "No requestFile is provided.")
		return
	}

	dest := query.Get("dest")
	if dest == "" {
		sendStatusCode(w, http.StatusBadRequest, "Destination path not provided.")
		return
	}

	fileName := utils.GetFileNameWithExtension(requestedFile)
	dest = utils.JoinPath(internals.DataFolderPath, dest, fileName)
	if utils.IsFileExist(dest) {
		dest = createNewFilePath(dest)
	}

	moveError := utils.CopyFile(requestedFile, dest)
	if moveError != nil {
		sendStatusCode(w, http.StatusInternalServerError, fmt.Sprintf(
			"Could not move file\n%s",
			moveError,
		))
		return
	}

	sendStatusCode(w, http.StatusOK, "Looking great")
}
