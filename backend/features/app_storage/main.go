package app_storage

import (
	"toast/backend/core/internals"
	"toast/backend/debug"
)

type Exports struct {
	db *GDStore
}

var internalAppDb *GDStore = nil

func OnShutdown() {
	if internalAppDb == nil {
		return
	}

	internalAppDb.Consolidate()
	internalAppDb.Close()
	internalAppDb = nil
}

func (storage *Exports) ensureOpened() {
	if storage.db == nil {
		storage.db = New(internals.DATA_FOLDER_PATH + "/app_storage.db")
		internalAppDb = storage.db
	}
}

func (storage *Exports) AppStorage_Get(key string) string {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("app/storage", "get: %s", key)
	}

	storage.ensureOpened()
	value, isExist := storage.db.Get(key)
	if !isExist {
		return ""
	}

	return string(value)
}

func (storage *Exports) AppStorage_Set(key string, value string) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("app/storage", "set: %s = %s", key, value)
	}

	storage.ensureOpened()
	storage.db.Put(key, []byte(value))
}

func (storage *Exports) AppStorage_Delete(key string) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("app/storage", "delete: %s", key)
	}

	storage.ensureOpened()
	storage.db.Delete(key)
}
