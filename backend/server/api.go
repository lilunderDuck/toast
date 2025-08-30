package server

import (
	"errors"
	"net/http"
	"path/filepath"
	"toast/backend/db"
	"toast/backend/internals"
)

type simpleDbInput struct {
	Key   string `json:"key"`
	Value string `json:"value,omitempty"`
}

func createApiRoute(server *http.ServeMux) {
	server.HandleFunc("POST /api/db", func(res http.ResponseWriter, req *http.Request) {
		batch(res, req, true, func(db *db.DbInstance, key, value string) {
			db.SetString(key, value)
		})
	})

	server.HandleFunc("DELETE /api/db", func(res http.ResponseWriter, req *http.Request) {
		batch(res, req, false, func(db *db.DbInstance, key, value string) {
			db.DeleteString(key)
		})
	})

	// server.HandleFunc("GET /api/db", func(res http.ResponseWriter, req *http.Request) {
	// 	getAll := req.URL.Query().Get("all")
	// 	batch(res, req, false, func(db *db.DbInstance, key, value string) {
	// 		var result any
	// 		if getAll == "1" {
	// 			result = db.GetAllString()
	// 		} else {
	// 			result, _ = db.GetString(key)
	// 		}

	// 		responseInJson(res, 200, JSON{
	// 			"result": result,
	// 		})
	// 	})
	// })
}

type batchFn func(db *db.DbInstance, key, value string)

func batch(res http.ResponseWriter, req *http.Request, valueRequired bool, batchFn batchFn) {
	dbName := req.URL.Query().Get("dbName")
	embedName := req.URL.Query().Get("embedName")

	var out simpleDbInput
	err := readRequestInJson(req, &out)
	if err != nil {
		responseWithError(res, 404, "validation_err", err)
		return
	}

	if valueRequired && out.Value == "" {
		responseWithError(res, 404, "validation_err", errors.New("field \"value\" is required."))
		return
	}

	if embedName == "" {
		responseWithError(res, 404, "missing_query", err)
		return
	}

	dbSavedLocation := filepath.Join(internals.EMBED_SAVED_PATH, embedName, "db", dbName)
	err = db.OpenThenClose(dbSavedLocation, func(db *db.DbInstance) {
		batchFn(db, out.Key, out.Value)
	})

	if valueRequired && out.Value == "" {
		responseWithError(res, 404, "db_err", err)
		return
	}
}
