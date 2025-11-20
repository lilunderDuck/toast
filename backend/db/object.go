package db

func (db *Instance) Get(key []byte) ([]byte, error) {
	return db.internal.Get(key, nil)
}

func (db *Instance) Set(key []byte, value []byte) error {
	return db.internal.Put(key, value, nil)
}

func (db *Instance) Delete(key []byte) error {
	return db.internal.Delete(key, nil)
}

func (db *Instance) Iterate(fn func(key, data []byte)) {
	iter := db.internal.NewIterator(nil, nil)
	for iter.Next() {
		// Remember that the contents of the returned slice should not be modified, and
		// only valid until the next call to Next.
		fn(iter.Key(), iter.Value())
	}
	iter.Release()
}
