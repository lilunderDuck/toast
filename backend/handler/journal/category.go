package journal

import "time"

type CategorySchema struct {
	Name string `form:"name" json:"name" binding:"required"`
}

type CategoryUpdateSchema struct {
	Name string `form:"name" json:"name"`
}

type CategoryData struct {
	Id       int           `json:"id"                 cbor:"0,keyasint"`
	Type     uint8         `json:"type"               cbor:"1,keyasint"`
	Created  time.Duration `json:"created"            cbor:"2,keyasint"`
	Modified time.Duration `json:"modified,omitempty" cbor:"3,keyasint,omitempty"`
	Name     string        `json:"name"               cbor:"4,keyasint"`
}
