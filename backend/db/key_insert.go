package db

import (
	"strconv"
)

func getKey(key int) []byte {
	return []byte(strconv.Itoa(key))
}
