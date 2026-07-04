package app_storage

import (
	"errors"
	"fmt"
	"strings"
)

type Action string

var (
	ActionPut    Action = "SET"
	ActionDelete Action = "DEL"
)

var (
	ErrCannotDecodeElement = errors.New("failed to decode element")
	ErrBadLine             = errors.New("bad line")
)

type Entry struct {
	Action Action
	Key    string
	Value  []byte
}

const ENTRY_SEPERATOR = "\u25A0"

func (e *Entry) toLine() []byte {
	return fmt.Appendf(nil, "%s%s%s%s%s\n", e.Action, ENTRY_SEPERATOR, e.Key, ENTRY_SEPERATOR, e.Value)
}

func newEntry(action Action, key string, value []byte) *Entry {
	return &Entry{
		Action: action,
		Key:    key,
		Value:  value,
	}
}

func newBulkEntries(action Action, keyValues map[string][]byte) []*Entry {
	var entries []*Entry
	for k, v := range keyValues {
		entries = append(entries, &Entry{
			Action: action,
			Key:    k,
			Value:  v,
		})
	}
	return entries
}

func newEntryFromLine(line string) (*Entry, error) {
	elements := strings.Split(line, ENTRY_SEPERATOR)
	if len(elements) != 3 {
		return nil, ErrBadLine
	}
	keyAsBytes := elements[1]
	key := string(keyAsBytes)
	value := elements[2]
	return &Entry{
		Action: Action(elements[0]),
		Key:    key,
		Value:  []byte(value),
	}, nil
}
