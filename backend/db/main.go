package db

import (
	"fmt"

	"github.com/syndtr/goleveldb/leveldb"
)

type LevelDbBatchFn func(db *LevelDb)
type LevelDb struct {
	internal *leveldb.DB
}

func (db *LevelDb) Close() error {
	return db.internal.Close()
}

func Open(path string) (*LevelDb, error) {
	db, err := leveldb.OpenFile(path, nil)
	if err != nil {
		return nil, err
	}

	return &LevelDb{
		internal: db,
	}, nil
}

func OpenThenClose(location string, batch LevelDbBatchFn) error {
	db, err := Open(location)
	if err != nil {
		fmt.Println(err)
		return err
	}

	batch(db)
	return db.Close()
}
