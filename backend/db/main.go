package db

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"sync"
	"toast/backend/debug"

	"github.com/elliotchance/orderedmap/v2"
)

type GDStore struct {
	// FilePath is the path to the file used to persist
	FilePath string

	// useBuffer lets the user define if GDStore should use a buffer, or write directly to the file.
	//
	// Writing to a buffer is much faster, but failure to close to the store (GDStore.Close()) will
	// result in a buffer that hasn't been flushed, meaning some entries may be lost.
	// You can manually flush the buffer by using GDStore.Flush().
	//
	// In contrast, writing to the file without a buffer is slower, but more reliable if your
	// application is prone to suddenly crashing
	//
	// Defaults to false
	useBuffer bool

	// persistence lets the user set whether to persist data to the file or not. Meant to be used for testing without
	// having to clean up the file.
	//
	// (default) If set to true, data is available both in-memory and persisted to the file found at FilePath.
	// If set to false, data is available only in-memory, and upon destruction, all data will be lost.
	//
	// Defaults to true
	persistence bool

	file   *os.File
	writer *bufio.Writer
	data   *orderedmap.OrderedMap[string, []byte]
	mux    sync.RWMutex
}

// New creates a new GDStore
func New(filePath string) *GDStore {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("gdscore", "opening %s", debug.FormatPath(filePath))
	}

	store := &GDStore{
		FilePath:    filePath,
		data:        orderedmap.NewOrderedMap[string, []byte](),
		persistence: true,
	}
	err := store.loadFromDisk()
	if err != nil {
		panic(err)
	}
	return store
}

// WithBuffer sets GDStore's useBuffer parameter to the value passed as parameter
//
// The default value for useBuffer is false
func (store *GDStore) WithBuffer(useBuffer bool) *GDStore {
	store.useBuffer = useBuffer
	return store
}

// WithPersistence sets GDStore's persistence parameter to the value passed as parameter
//
// # The ability to set persistence to false is there mainly for testing purposes
//
// The default value for persistence is true
func (store *GDStore) WithPersistence(persistence bool) *GDStore {
	store.persistence = persistence
	return store
}

// Get returns the value of a key as well as a bool that indicates whether an entry exists for that key.
//
// The bool is particularly useful if you want to differentiate between a key that has a nil value, and a
// key that doesn't exist
func (store *GDStore) Get(key string) (value []byte, ok bool) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("gdscore", "get value with key: %s", key)
	}

	store.mux.RLock()
	value, ok = store.data.Get(key)
	store.mux.RUnlock()
	return
}

// GetString does the same thing as Get, but converts the value to a string
func (store *GDStore) GetString(key string) (valueAsString string, ok bool) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("gdscore", "get string with key: %s", key)
	}

	var value []byte
	value, ok = store.Get(key)
	if ok {
		valueAsString = string(value)
	}
	return
}

// GetInt does the same thing as Get, but converts the value to an int
func (store *GDStore) GetInt(key string) (valueAsInt int, ok bool, err error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("gdscore", "get int with key: %s", key)
	}

	var value string
	value, ok = store.GetString(key)
	if ok {
		valueAsInt, err = strconv.Atoi(value)
	}
	return
}

// Put creates an entry or updates the value of an existing key
func (store *GDStore) Put(key string, value []byte) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("gdscore", "set: %s = %.20s", key, value)
	}

	store.mux.Lock()
	defer store.mux.Unlock()
	store.data.Set(key, value)
	return store.appendEntryToFile(newEntry(ActionPut, key, value))
}

// PutAll creates or updates a map of entries
func (store *GDStore) PutAll(entries map[string][]byte) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("gdscore", "putting all values...")
	}

	store.mux.Lock()
	defer store.mux.Unlock()
	for key, value := range entries {
		store.data.Set(key, value)
	}
	return store.appendEntriesToFile(newBulkEntries(ActionPut, entries))
}

// Delete removes a key from the store
func (store *GDStore) Delete(key string) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("gdscore", "delete value with key: %s", key)
	}

	store.mux.Lock()
	defer store.mux.Unlock()
	didDelete := store.data.Delete(key)
	if !didDelete {
		return fmt.Errorf("failed to delete")
	}
	return store.appendEntryToFile(newEntry(ActionDelete, key, nil))
}

// Count returns the total number of entries in the store
func (store *GDStore) Count() int {
	store.mux.RLock()
	length := store.data.Len()
	store.mux.RUnlock()
	return length
}

// Keys returns a list of all keys
func (store *GDStore) Keys() []string {
	store.mux.RLock()
	defer store.mux.RUnlock()

	keys := store.data.Keys()

	copiedKeys := make([]string, len(keys))
	copy(copiedKeys, keys)
	return copiedKeys
}

// Values returns a list of all values
func (store *GDStore) Values() [][]byte {
	store.mux.RLock()
	values := make([][]byte, 0, store.data.Len())
	for el := store.data.Front(); el != nil; el = el.Next() {
		values = append(values, el.Value)
	}
	store.mux.RUnlock()
	return values
}
