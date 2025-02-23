package backend

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"
	"net/http"
	"strings"
)

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	var err error
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	println("Requesting file:", requestedFilename)
	fileData, err := utils.ReadFile(internals.AppCurrentDirectory + "/" + requestedFilename)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write(fmt.Appendf(nil, "Could not load file %s", requestedFilename))
	}

	res.Write(fileData)
}
