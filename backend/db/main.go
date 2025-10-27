// This is a wrapper for the lotusdb key-value store.
// It simplifies common operations like opening, closing, and managing a single instance
// of a database based on a given path.
package db

import (
	"fmt"
	"sync"

	"github.com/lotusdblabs/lotusdb/v2"
)

// A function type used to perform a batch of
// database operations on a given lotusdb instance.
type lotusdbBatchFn func(db *DbInstance)

// A wrapper struct that holds the internal lotusdb database instance.
type DbInstance struct {
	internal *lotusdb.DB
}

// Closes the underlying lotusdb database. It should be called when
// the database is no longer needed to release resources.
func (db *DbInstance) Close() error {
	return db.internal.Close()
}

// A map used to track and store the instances of lotusdb,
// with the database path as the key.
//
// Notes: this is **not** thread safe
//
// Update: it's now thread safe, thank god
var (
	globalDbInstance = map[string]*DbInstance{}
	lock             sync.Mutex
)

// Opens a lotusdb database at the specified file path.
// Returns a instance of lotusdb.
//
// If the database for the given path is already open, it returns the existing instance.
func Open(path string) (*DbInstance, error) {
	fmt.Println("Opening: ", path)
	lock.Lock()
	defer lock.Unlock()

	if instance, ok := globalDbInstance[path]; ok {
		return instance, nil
	}

	db, err := lotusdb.Open(lotusdb.Options{
		DirPath: path,
	})
	if err != nil {
		return nil, err
	}

	dbInstance := &DbInstance{
		internal: db,
	}

	globalDbInstance[path] = dbInstance

	return dbInstance, nil
}

// Closes the lotusdb instance at the specified path and removes it
// from the global map.
func Close(path string) {
	lock.Lock()
	defer lock.Unlock()

	globalDbInstance[path].Close()
	delete(globalDbInstance, path)
}

// Closes all opened lotusdb instances and clears the global singleton map.
func CloseAll() {
	lock.Lock()
	defer lock.Unlock()

	for dbPath, db := range globalDbInstance {
		db.Close()
		delete(globalDbInstance, dbPath)
	}
}

// Gets an existing lotusdb instance for the given path.
//
// If an instance is not found, it attempts to open a new one.
//
// Note: while this function attempts to handle a missing instance,
// it is better to call [Open()] explicitly to handle errors.
func GetInstance(path string) *DbInstance {
	lock.Lock()
	defer lock.Unlock()

	instance, ok := globalDbInstance[path]
	if !ok {
		fmt.Println("No instance found: ", path, ". Try opening it.")
		newInstance, _ := Open(path)
		instance = newInstance
	}

	fmt.Println("Existing instance found:", path)
	return instance
}

// Opens a lotusdb database, executes a batch of operations, and then closes the database.
//
// This function handles the full lifecycle of a temporary database session.
func OpenThenClose(location string, batch lotusdbBatchFn) error {
	db, err := Open(location)
	if err != nil {
		fmt.Println(err)
		return err
	}

	batch(db)
	return db.Close()
}
