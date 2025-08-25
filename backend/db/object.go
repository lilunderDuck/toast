package db

import (
	"github.com/fxamacker/cbor/v2"
	"github.com/lotusdblabs/lotusdb/v2"
)

func (db *DbInstance) GetObject(key int, out any) error {
	data, err := db.internal.Get(getKey(key))
	if err != nil {
		return err
	}

	return cbor.Unmarshal(data, out)
}

func (db *DbInstance) SetObject(key int, value any) error {
	data, err := cbor.Marshal(value)
	if err != nil {
		return err
	}

	return db.internal.Put(getKey(key), data)
}

func (db *DbInstance) DeleteObject(key int) error {
	return db.internal.Delete(getKey(key))
}

func (db *DbInstance) Iterate(fn func(data []byte)) {
	iter, _ := db.internal.NewIterator(lotusdb.IteratorOptions{})
	for iter.Valid() {
		value := iter.Value()
		fn(value)
		iter.Next()
	}
	iter.Close()
}
