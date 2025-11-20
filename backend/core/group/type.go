package group

import (
	"time"
	"toast/backend/utils"
)

// Defines the structure for updating an existing group.
type GroupOptions struct {
	Name        string       `json:"name,omitempty"`
	Description string       `json:"description,omitempty"`
	Icon        string       `json:"icon,omitempty"`
	Explorer    ExplorerData `json:"explorer,omitempty"`
}

// Represents the complete data for a group
type GroupData struct {
	Id          string        `json:"id"                    cbor:"0,keyasint"`
	Created     time.Duration `json:"created"               cbor:"1,keyasint"`
	Modified    time.Duration `json:"modified,omitempty"    cbor:"2,keyasint,omitempty"`
	Name        string        `json:"name"                  cbor:"3,keyasint"`
	Description string        `json:"description,omitempty" cbor:"4,keyasint,omitempty"`
	Icon        string        `json:"icon"                  cbor:"5,keyasint"`
	Explorer    ExplorerData  `json:"explorer,omitempty"    cbor:"6,keyasint,omitempty"`
}

func newGroupData(options *GroupOptions) *GroupData {
	return &GroupData{
		Id:          utils.GetRandomStringWithinLength(8),
		Created:     utils.GetCurrentDateNow(),
		Name:        options.Name,
		Description: options.Description,
		Explorer:    ExplorerData{},
	}
}

// Represents a node in a virtual tree structure.
// It has an ID and a list of child nodes.
type ExplorerNode struct {
	Id    string         `form:"id"    json:"id"               cbor:"0,keyasint"`
	Child []ExplorerNode `form:"child" json:"child,omitempty"  cbor:"1,keyasint,omitempty"`
}

type ExplorerData struct {
	Mapping map[string]string `json:"mapping"  cbor:"0,keyasint"`
	Tree    []ExplorerNode    `json:"tree"     cbor:"1,keyasint"`
}

type Setting struct {
	Tags []TagData `json:"tags,omitempty"         cbor:"0,keyasint"`
}

type TagData struct {
	Name        string `json:"name"                    cbor:"0,keyasint"`
	Color       string `json:"color"                   cbor:"1,keyasint"`
	Description string `json:"description,omitempty"   cbor:"2,keyasint"`
}
