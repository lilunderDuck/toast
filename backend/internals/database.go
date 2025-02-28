package internals

import (
	"burned-toast/backend/utils"
	"encoding/json"
	"fmt"
	"log"

	"github.com/akrylysov/pogreb"
)

func openDatabase(name string) *pogreb.DB {
	dbPath := fmt.Sprintf("%s/%s", CacheFolderPath, name)
	db, dbError := pogreb.Open(dbPath, nil /*no options*/)

	if dbError != nil {
		panic(dbError)
	}

	return db
}

type CacheUtils struct{}

func Cache_Set[T any](db *pogreb.DB, key string, value T) error {
	jsonInBinary, encodeError := json.Marshal(&value)
	if encodeError != nil {
		panic(encodeError)
	}

	keyInBinary := []byte(key)
	isThisKeyExist, someError := db.Has(keyInBinary)
	if someError != nil {
		panic(someError)
	}

	if isThisKeyExist {
		Cache_Delete(db, key)
	}

	setError := db.Put(keyInBinary, jsonInBinary)
	if setError != nil {
		panic(setError)
	}

	Cache_GetAllValue(db)

	return nil
}

func Cache_Get[T any](db *pogreb.DB, key string, outData T) error {
	value, readError := db.Get([]byte(key))
	if readError != nil {
		return readError
	}

	json.Unmarshal(value, &outData)
	return nil
}

func Cache_Delete(db *pogreb.DB, key string) error {
	someError := db.Delete([]byte(key))
	if someError != nil {
		panic(someError)
	}

	db.Compact()
	db.Sync()

	return nil
}

func Cache_GetAllValue(db *pogreb.DB) []any {
	it := db.Items()
	var item []any
	for {
		_, val, err := it.Next()
		if err == pogreb.ErrIterationDone {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		var jsonVal any
		json.Unmarshal(val, &jsonVal)
		item = append(item, jsonVal)
	}

	return item
}

func Cache_GetAll(db *pogreb.DB) map[string]any {
	it := db.Items()
	outMap := make(map[string]any)
	for {
		key, val, err := it.Next()
		if err == pogreb.ErrIterationDone {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		var jsonVal any
		json.Unmarshal(val, &jsonVal)
		outMap[utils.BytesToString(key)] = jsonVal
		fmt.Println(utils.BytesToString(key), jsonVal)
	}

	return outMap
}

type CacheUpdateFn func(db *pogreb.DB)

func Cache_Update(dbName string, updateFn CacheUpdateFn) {
	db := openDatabase(dbName)
	defer db.Close()
	println("make some mess to the server database now -> ", dbName)

	updateFn(db)
}
