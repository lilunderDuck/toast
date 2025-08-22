// This is a wrapper for the LevelDB key-value store.
// It simplifies common operations like opening, closing, and managing a single instance
// of a database based on a given path.
package db

import (
	"fmt"

	"github.com/syndtr/goleveldb/leveldb"
)

// A function type used to perform a batch of
// database operations on a given LevelDb instance.
type LevelDbBatchFn func(db *LevelDb)

// A wrapper struct that holds the internal LevelDB database instance.
type LevelDb struct {
	internal *leveldb.DB
}

// Closes the underlying LevelDB database. It should be called when
// the database is no longer needed to release resources.
func (db *LevelDb) Close() error {
	return db.internal.Close()
}

// A map used to track and store the instances of LevelDb,
// with the database path as the key.
//
// Notes: this is **not** thread safe
var globalDbInstance = map[string]*LevelDb{}

// Opens a LevelDB database at the specified file path.
// Returns a instance of LevelDb.
//
// If the database for the given path is already open, it returns the existing instance.
func Open(path string) (*LevelDb, error) {
	fmt.Println("Opening: ", path)
	if instance, ok := globalDbInstance[path]; ok {
		return instance, nil
	}

	db, err := leveldb.OpenFile(path, nil)
	if err != nil {
		return nil, err
	}

	dbInstance := &LevelDb{
		internal: db,
	}

	globalDbInstance[path] = dbInstance

	return dbInstance, nil
}

// Closes the LevelDB instance at the specified path and removes it
// from the global map.
func Close(path string) {
	globalDbInstance[path].Close()
	delete(globalDbInstance, path)
}

// Closes all opened LevelDB instances and clears the global singleton map.
func CloseAll() {
	for dbPath, db := range globalDbInstance {
		db.Close()
		delete(globalDbInstance, dbPath)
	}
}

// Gets an existing LevelDB instance for the given path.
//
// If an instance is not found, it attempts to open a new one.
//
// Note: while this function attempts to handle a missing instance,
// it is better to call [Open()] explicitly to handle errors.
func GetInstance(path string) *LevelDb {
	instance, ok := globalDbInstance[path]
	if !ok {
		fmt.Println("No instance found: ", path, ". Try opening it.")
		newInstance, _ := Open(path)
		instance = newInstance
	}
	return instance
}

// Opens a LevelDB database, executes a batch of operations, and then closes the database.
//
// This function handles the full lifecycle of a temporary database session.
func OpenThenClose(location string, batch LevelDbBatchFn) error {
	db, err := Open(location)
	if err != nil {
		fmt.Println(err)
		return err
	}

	batch(db)
	return db.Close()
}
