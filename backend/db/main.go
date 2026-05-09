// This is a wrapper for the key-value store.
// It simplifies common operations like opening, closing, and managing a single instance
// of a database based on a given path.
package db

import (
	"path/filepath"
	"toast/backend/debug"

	"github.com/tidwall/buntdb"
)

// A function type used to perform a batch of
// database operations on a given instance.
type batchFn func(db *Instance)

// A wrapper struct that holds the internal database instance.
type Instance struct {
	internal *buntdb.DB
	name     string
}

// Closes the underlying database. It should be called when
// the database is no longer needed to release resources.
func (db *Instance) Close() error {
	if debug.DEBUG_MODE {
		debug.LogLabel("db/json", "Database closed")
	}
	return db.internal.Close()
}

// A map used to track and store the instances of currently opened database instance,
// with the database path as the key.
//
// Notes: this is **not** thread safe
//
// Update: it's now thread safe, thank god
var (
	globalInstance = map[string]*Instance{}
)

// Opens a database at the specified file path.
// Returns the database instance.
//
// If the database for the given path is already open, it returns the existing instance.
func Open(path string) (*Instance, error) {
	if debug.DEBUG_MODE {
		debug.LogLabelf("db/json", "Opening: %s", path)
	}

	if instance := GetInstance(path); instance != nil {
		return instance, nil
	}

	db, err := buntdb.Open(path)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.Err(err, path)
		}

		return nil, err
	}

	instance := &Instance{
		internal: db,
		name:     filepath.Base(path),
	}
	globalInstance[path] = instance
	return instance, nil
}

// Closes the instance at the specified path and removes it
// from the global map.
func Close(path string) {
	globalInstance[path].Close()
	delete(globalInstance, path)
	if debug.DEBUG_MODE {
		debug.Log("Database closed.", path)
	}
}

// Closes all opened instances and clears the global singleton map.
func CloseAll() {
	for path, instance := range globalInstance {
		instance.Close()
		delete(globalInstance, path)
		if debug.DEBUG_MODE {
			debug.Log("Database closed.", path)
		}
	}
}

// Gets an existing instance for the given path.
//
// If an instance is not found, it attempts to open a new one.
//
// Note: while this function attempts to handle a missing instance,
// it is better to call [Open()] explicitly to handle errors.
func GetInstance(path string) *Instance {
	instance, ok := globalInstance[path]
	if !ok {
		if debug.DEBUG_MODE {
			debug.LogLabelf("db/json", "No instance found: %s", path)
		}

		return nil
	}

	if debug.DEBUG_MODE {
		debug.LogLabelf("db/json", "Existing instance found: %s", path)
	}

	return instance
}
