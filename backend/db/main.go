// This is a wrapper for the key-value store.
// It simplifies common operations like opening, closing, and managing a single instance
// of a database based on a given path.
package db

import (
	"fmt"
	"path/filepath"
	"strings"
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
	err := db.internal.Shrink()
	if err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabelf("db/json", "%s %v", debugFormatDatabaseName(db.name), err)
		}
		return err
	}

	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "%s closing database...", debugFormatDatabaseName(db.name))
	}
	return db.internal.Close()
}

// A map used to track and store the instances of currently opened database instance,
// with the database path as the key.
//
// Notes: this is **not** thread safe
var (
	globalInstance = map[string]*Instance{}
)

// Opens a database at the specified file path.
// Returns the database instance.
//
// If the database for the given path is already open, it returns the existing instance.
func Open(path string) (*Instance, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "Opening: %s", debug.FormatPath(path))
	}

	if instance := GetInstance(path); instance != nil {
		return instance, nil
	}

	db, err := buntdb.Open(path)
	if err != nil {
		if debug.DEBUG_MODE {
			if strings.Contains(err.Error(), "invalid database") {
				iHaveMessedUp := []string{
					"Well, if the code reached this point, then I have to safely say",
					"to you that we've messed up... quite good, to the point that the",
					"database just refuse to open. Isn't that lovely?",
					"",
					"At least it's not in a *binary format*, so it's not really the end",
					"of the world, basically.",
					"",
					"Also, how did you get here? Did you build this app in debug mode?",
				}
				debug.ErrLabelf("db/json", "%s", strings.Join(iHaveMessedUp, "\n"))
			}
			debug.ErrLabel("db/json", err)
		}

		return nil, err
	}

	instance := &Instance{internal: db}
	if debug.DEBUG_MODE {
		filePath, fileName := filepath.Split(path)
		instance.name = fmt.Sprintf("%s/%s", filepath.Base(filePath), fileName)
		debug.InfoLabelf("db/json", "%s opened to mess with the data", debugFormatDatabaseName(instance.name))
	}

	globalInstance[path] = instance
	return instance, nil
}

// Closes the instance at the specified path and removes it
// from the global map.
func Close(path string) {
	globalInstance[path].Close()
	delete(globalInstance, path)
}

// Closes all opened instances and clears the global singleton map.
func CloseAll() {
	for path, instance := range globalInstance {
		instance.Close()
		delete(globalInstance, path)
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
			debug.InfoLabelf("db/json", "No instance found: %s", debug.FormatPath(path))
		}

		return nil
	}

	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "Existing instance found: %s", debug.FormatPath(path))
	}

	return instance
}
