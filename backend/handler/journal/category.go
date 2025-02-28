package journal

import "time"

// Defines how a new category should be created.
type CategorySchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

// Defines how a category can be updated.
type CategoryUpdateSchema struct {
	Name string `form:"name" json:"name"`
}

// Holds all the information about a category.
//
// You can think of it as a folder.
type CategoryData struct {
	Id       int           `json:"id"                 cbor:"0,keyasint"`
	Type     uint8         `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string        `json:"name"               cbor:"4,keyasint"`
}
