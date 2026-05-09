package db

import (
	"strings"
	"toast/backend/debug"

	"github.com/tidwall/buntdb"
)

func (db *Instance) Get(key string) (string, error) {
	if debug.DEBUG_MODE {
		debug.LogLabelf("json/db", "[%s] get %s", db.name, key)
	}

	out := ""
	err := db.internal.View(func(tx *buntdb.Tx) error {
		dataOut, err := tx.Get(key)
		out = dataOut
		return err
	})

	return out, err
}

func (db *Instance) Set(key string, value string) error {
	if debug.DEBUG_MODE {
		debug.LogLabelf("json/db", "[%s] set %s = %s", db.name, key, value)
	}

	return db.internal.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(key, value, nil)
		return err
	})
}

type updateFn func(oldData string) (string, error)

func (db *Instance) Update(key string, updateFn updateFn) error {
	if debug.DEBUG_MODE {
		debug.LogLabelf("json/db", "[%s] updating %s", db.name, key)
	}

	return db.internal.Update(func(tx *buntdb.Tx) error {
		value, err := tx.Get(key)
		if err != nil {
			return err
		}

		newValue, err := updateFn(value)
		if err != nil {
			return err
		}

		_, _, err = tx.Set(key, newValue, nil)
		return err
	})
}

func (db *Instance) Delete(key string) error {
	if debug.DEBUG_MODE {
		debug.LogLabelf("json/db", "[%s] delete %s", db.name, key)
	}

	return db.internal.Update(func(tx *buntdb.Tx) error {
		_, err := tx.Delete(key)
		return err
	})
}

func (db *Instance) Iterate(fn func(key, data string)) {
	if debug.DEBUG_MODE {
		debug.LogLabelf("json/db", "[%s] iterating...", db.name)
	}

	db.internal.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			fn(key, value)
			return true
		})
		return err
	})
}

func (db *Instance) GetAll() string {
	if debug.DEBUG_MODE {
		debug.LogLabelf("json/db", "[%s] get all data", db.name)
	}

	var stringBuilder strings.Builder
	stringBuilder.WriteString("[")

	first := true
	db.internal.View(func(tx *buntdb.Tx) error {
		return tx.Ascend("", func(key, value string) bool {
			if !first {
				stringBuilder.WriteString(",")
			}
			stringBuilder.WriteString(value)
			first = false
			return true
		})
	})
	stringBuilder.WriteString("]")

	return stringBuilder.String()
}
