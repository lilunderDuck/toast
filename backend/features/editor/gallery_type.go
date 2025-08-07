package editor

import (
	"time"
)

type GalleryData struct {
	Id          int           `json:"id"                       cbor:"0,keyasint"`
	Created     time.Duration `json:"created,omitempty"        cbor:"1,keyasint"`
	Modified    time.Duration `json:"modified,omitempty"       cbor:"2,keyasint"`
	Items       []GalleryItem `json:"items"                    cbor:"3,keyasint"`
	Name        string        `json:"name,omitempty"           cbor:"4,keyasint"`
	Description string        `json:"description,omitempty"    cbor:"5,keyasint"`
	BasePath    string        `json:"basePath,omitempty"       cbor:"6,keyasint"`
}

type GalleryItem struct {
	Type        uint8         `json:"type"                      cbor:"0,keyasint"`
	Name        string        `json:"name"                      cbor:"1,keyasint"`
	Description string        `json:"description,omitempty"     cbor:"2,keyasint"`
	AddedDate   time.Duration `json:"addedDate"                 cbor:"3,keyasint"`
}

type GalleryUpdatedData struct {
	Items       []GalleryItem `json:"items,omitempty"`
	Name        string        `json:"name,omitempty"`
	Description string        `json:"description,omitempty"`
}
