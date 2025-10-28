package db

import (
	"github.com/fxamacker/cbor/v2"
	"github.com/lotusdblabs/lotusdb/v2"
)

func (db *DbInstance) GetObject(key string, out any) error {
	data, err := db.internal.Get([]byte(key))
	if err != nil {
		return err
	}

	return cbor.Unmarshal(data, out)
}

func (db *DbInstance) SetObject(key string, value any) error {
	data, err := cbor.Marshal(value)
	if err != nil {
		return err
	}

	return db.internal.Put([]byte(key), data)
}

func (db *DbInstance) DeleteObject(key string) error {
	return db.internal.Delete([]byte(key))
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

func GetAll[T any](dbName string) []T {
	dbInstance := GetInstance(dbName)

	var content []T
	dbInstance.Iterate(func(data []byte) {
		var out T
		err := cbor.Unmarshal(data, &out)
		if err != nil {
			return
		}

		content = append(content, out)
	})

	return content
}
