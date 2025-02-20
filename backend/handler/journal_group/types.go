package journal_group

import "time"

// ---------------------------------------------------------------

type Schema struct {
	Name        string `form:"name"        json:"name"      binding:"required"`
	Description string `form:"description" json:"description,omitempty"`
}

type UpdateSchema struct {
	Name        string      `form:"name"        json:"name,omitempty"`
	Description string      `form:"description" json:"description,omitempty"`
	Tree        VirTreeList `form:"tree"        json:"tree,omitempty"`
	Item        int         `form:"item"        json:"item,omitempty"`
}

type Data struct {
	Id          int           `json:"id"                    cbor:"0,keyasint"`
	Created     time.Duration `json:"created"               cbor:"1,keyasint"`
	Modified    time.Duration `json:"modified,omitempty"    cbor:"2,keyasint,omitempty"`
	Name        string        `json:"name"                  cbor:"3,keyasint"`
	Description string        `json:"description,omitempty" cbor:"4,keyasint,omitempty"`
	Tree        VirTreeData   `json:"tree"                  cbor:"5,keyasint,toarray"`
}
