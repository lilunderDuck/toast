package db

import "github.com/fxamacker/cbor/v2"

func (db *LevelDb) GetObject(key int, out any) error {
	data, err := db.internal.Get(getKey(key), nil)
	if err != nil {
		return err
	}

	return cbor.Unmarshal(data, out)
}

func (db *LevelDb) SetObject(key int, value any) error {
	data, err := cbor.Marshal(value)
	if err != nil {
		return err
	}

	return db.internal.Put(getKey(key), data, nil)
}

func (db *LevelDb) DeleteObject(key int) error {
	return db.internal.Delete(getKey(key), nil)
}

func (db *LevelDb) GetAllObject(thisInterf any) []any {
	iter := db.internal.NewIterator(nil, nil)
	content := []any{}
	for iter.Next() {
		value := iter.Value()
		err := cbor.Unmarshal(value, thisInterf)
		if err != nil {
			continue
		}

		content = append(content, thisInterf)
	}
	iter.Release()
	return content
}
