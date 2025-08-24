package journal

import "time"

// Defines the structure for updating an existing journal group.
type JournalGroupOptions struct {
	Name        string       `form:"name"        json:"name,omitempty"`
	Description string       `form:"description" json:"description,omitempty"`
	Icon        string       `form:"icon"        json:"icon,omitempty"`
	Tree        ExplorerData `form:"tree"        json:"tree,omitempty"`
}

// Represents the complete data for a journal group
type JournalGroupData struct {
	Id          int           `json:"id"                    cbor:"0,keyasint"`
	Created     time.Duration `json:"created"               cbor:"1,keyasint"`
	Modified    time.Duration `json:"modified,omitempty"    cbor:"2,keyasint,omitempty"`
	Name        string        `json:"name"                  cbor:"3,keyasint"`
	Description string        `json:"description,omitempty" cbor:"4,keyasint,omitempty"`
	Icon        string        `json:"icon"                  cbor:"5,keyasint"`
}
