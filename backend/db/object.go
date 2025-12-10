package db

import "toast/backend/debug"

func (db *Instance) Get(key []byte) ([]byte, error) {
	if debug.DEBUG_MODE {
		debug.Logf("db - %s: get %s", db.name, string(key))
	}
	return db.internal.Get(key, nil)
}

func (db *Instance) Set(key []byte, value []byte) error {
	if debug.DEBUG_MODE {
		debug.Logf("db - %s: set %s = %s", db.name, string(key), string(value))
	}
	return db.internal.Put(key, value, nil)
}

func (db *Instance) Delete(key []byte) error {
	if debug.DEBUG_MODE {
		debug.Logf("db - %s: delete %s", db.name, string(key))
	}
	return db.internal.Delete(key, nil)
}

func (db *Instance) Iterate(fn func(key, data []byte)) {
	if debug.DEBUG_MODE {
		debug.Logf("db - %s: iterating", db.name)
	}
	iter := db.internal.NewIterator(nil, nil)
	for iter.Next() {
		// Remember that the contents of the returned slice should not be modified, and
		// only valid until the next call to Next.
		fn(iter.Key(), iter.Value())
	}
	iter.Release()
}
