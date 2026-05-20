package db

import (
	"fmt"
	"strings"
	"toast/backend/debug"

	"github.com/tidwall/buntdb"
)

func debugFormatDatabaseName(name string) string {
	leftBracket := debug.FormatWith(debug.COLOR_GRAY, debug.STYLE_NONE, "[")
	rightBracket := debug.FormatWith(debug.COLOR_GRAY, debug.STYLE_NONE, "]")
	dbName := debug.FormatWith(debug.COLOR_MAGENTA, debug.STYLE_BOLD, name)
	return fmt.Sprintf("%s%s%s", leftBracket, dbName, rightBracket)
}

func (db *Instance) Get(key string) (string, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "%s get %s", debugFormatDatabaseName(db.name), key)
	}

	out := ""
	err := db.internal.View(func(tx *buntdb.Tx) error {
		dataOut, err := tx.Get(key)
		out = dataOut
		return err
	})

	if debug.DEBUG_MODE {
		if err != nil {
			debug.ErrLabel("db/json", err)
		}
	}

	return out, err
}

func (db *Instance) Set(key string, value string) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "%s set %s = %s", debugFormatDatabaseName(db.name), key, value)
	}

	err := db.internal.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(key, value, nil)
		if debug.DEBUG_MODE {
			if err != nil {
				debug.ErrLabel("db/json", err)
			}
		}
		return err
	})

	if debug.DEBUG_MODE {
		if err != nil {
			debug.ErrLabel("db/json", err)
		}
	}

	return err
}

type updateFn func(oldData string) (string, error)

func (db *Instance) Update(key string, updateFn updateFn) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "%s updating %s", debugFormatDatabaseName(db.name), key)
	}

	err := db.internal.Update(func(tx *buntdb.Tx) error {
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

	if debug.DEBUG_MODE {
		if err != nil {
			debug.ErrLabel("db/json", err)
		}
	}

	return err
}

func (db *Instance) Delete(key string) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "%s delete %s", debugFormatDatabaseName(db.name), key)
	}

	return db.internal.Update(func(tx *buntdb.Tx) error {
		_, err := tx.Delete(key)
		if debug.DEBUG_MODE {
			if err != nil {
				debug.ErrLabel("db/json", err)
			}
		}
		return err
	})
}

func (db *Instance) Iterate(fn func(key, data string)) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "%s iterating...", debugFormatDatabaseName(db.name))
	}

	db.internal.View(func(tx *buntdb.Tx) error {
		err := tx.Ascend("", func(key, value string) bool {
			fn(key, value)
			return true
		})

		if debug.DEBUG_MODE {
			if err != nil {
				debug.ErrLabel("db/json", err)
			}
		}

		return err
	})
}

func (db *Instance) GetAll() string {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("db/json", "%s get all data", debugFormatDatabaseName(db.name))
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

func (db *Instance) Has(key string) bool {
	result := false
	db.internal.View(func(tx *buntdb.Tx) error {
		_, err := tx.Get(key)
		if err != nil {
			result = false
		} else {
			result = true
		}

		return nil
	})

	return result
}
