// This is a wrapper for the leveldb key-value store.
// It simplifies common operations like opening, closing, and managing a single instance
// of a database based on a given path.
package db

import (
	"fmt"
	"sync"

	"github.com/syndtr/goleveldb/leveldb"
)

// A function type used to perform a batch of
// database operations on a given leveldb instance.
type leveldbBatchFn func(db *Instance)

// A wrapper struct that holds the internal leveldb database instance.
type Instance struct {
	internal *leveldb.DB
}

// Closes the underlying leveldb database. It should be called when
// the database is no longer needed to release resources.
func (db *Instance) Close() error {
	println("db closed")
	return db.internal.Close()
}

// A map used to track and store the instances of leveldb,
// with the database path as the key.
//
// Notes: this is **not** thread safe
//
// Update: it's now thread safe, thank god
var (
	globalInstance = map[string]*Instance{}
	lock           sync.Mutex
)

// Opens a leveldb database at the specified file path.
// Returns a instance of leveldb.
//
// If the database for the given path is already open, it returns the existing instance.
func Open(path string) (*Instance, error) {
	fmt.Println("Opening: ", path)
	lock.Lock()
	defer lock.Unlock()

	if instance, ok := globalInstance[path]; ok {
		fmt.Println("Exiting instance found")
		return instance, nil
	}

	db, err := leveldb.OpenFile(path, nil)
	if err != nil {
		println(err)
		return nil, err
	}

	Instance := &Instance{internal: db}

	globalInstance[path] = Instance

	return Instance, nil
}

// Closes the leveldb instance at the specified path and removes it
// from the global map.
func Close(path string) {
	lock.Lock()
	defer lock.Unlock()

	globalInstance[path].Close()
	delete(globalInstance, path)
}

// Closes all opened leveldb instances and clears the global singleton map.
func CloseAll() {
	lock.Lock()
	defer lock.Unlock()

	for dbPath, db := range globalInstance {
		db.Close()
		delete(globalInstance, dbPath)
	}
}

// Gets an existing leveldb instance for the given path.
//
// If an instance is not found, it attempts to open a new one.
//
// Note: while this function attempts to handle a missing instance,
// it is better to call [Open()] explicitly to handle errors.
func GetInstance(path string) *Instance {
	lock.Lock()
	defer lock.Unlock()

	instance, ok := globalInstance[path]
	if !ok {
		fmt.Println("No instance found: ", path, ". Try opening it.")
		newInstance, _ := Open(path)
		instance = newInstance
	}

	fmt.Println("Existing instance found:", path)
	return instance
}

// Opens a leveldb database, executes a batch of operations, and then closes the database.
//
// This function handles the full lifecycle of a temporary database session.
func OpenThenClose(location string, batch leveldbBatchFn) error {
	db, err := Open(location)
	if err != nil {
		fmt.Println(err)
		return err
	}

	batch(db)
	return db.Close()
}
