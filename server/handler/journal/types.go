package journal

import "time"

type CategorySchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

type JournalSchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

type CategoryUpdateSchema struct {
	Name string `form:"name" json:"name"`
}

type JournalUpdateSchema struct {
	Name string               `form:"name" json:"name"`
	Data []JournalContentData `form:"data" json:"data"`
}

type JournalType uint8

const (
	Type_Journal  JournalType = 0
	Type_Category JournalType = 1
)

type CategoryData struct {
	Id       int           `json:"id"                 cbor:"0,keyasint"`
	Type     uint8         `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration `json:"modified,omitempty" cbor:"3,keyasint"`
	Name     string        `json:"name"               cbor:"4,keyasint"`
}

type JournalData struct {
	Id       int                  `json:"id"                 cbor:"0,keyasint"`
	Type     uint8                `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration        `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration        `json:"modified,omitempty" cbor:"3,keyasint"`
	Name     string               `json:"name"               cbor:"4,keyasint"`
	Data     []JournalContentData `json:"data"               cbor:"5,keyasint"`
}

type JournalContentData struct {
	Id    string         `json:"id"              cbor:"0,keyasint"`
	Type  string         `json:"type"            cbor:"1,keyasint"`
	Tunes struct{}       `json:"tunes,omitempty" cbor:"2,keyasint"`
	Data  map[string]any `json:"data"            cbor:"3,keyasint"`
}
