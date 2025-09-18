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
	Explorer    ExplorerData  `json:"explorer"              cbor:"6,keyasint"`
}

// Represents a node in a virtual tree structure.
// It has an ID and a list of child nodes.
type ExplorerNode struct {
	Id    int            `form:"id"    json:"id"               cbor:"0,keyasint"`
	Child []ExplorerNode `form:"child" json:"child,omitempty"  cbor:"1,keyasint,omitempty"`
}

// Representing a list of virtual trees.
type ExplorerTree []ExplorerNode

type ExplorerData struct {
	Mapping map[int]string `json:"mapping"  cbor:"0,keyasint"`
	Tree    ExplorerTree   `json:"tree"  cbor:"1,keyasint"`
}
