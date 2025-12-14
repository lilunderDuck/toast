package editor

import (
	"toast/backend/core/common"
	"toast/backend/utils"
)

type TableMetadata struct {
	Title string         `json:"title" cbor:"0,keyasint"`
	Id    string         `json:"id"    cbor:"1,keyasint"`
	Tabs  []TableTabData `json:"tabs"  cbor:"2,keyasint"`
}

func newTableMetadata() *TableMetadata {
	return &TableMetadata{
		Title: "Untitled",
		Id:    utils.GetRandomStringWithinLength(5),
		Tabs: []TableTabData{
			{Type: 0 /*table view*/, Name: "Table view", Id: utils.GetRandomStringWithinLength(5)},
		},
	}
}

type TableTabData struct {
	Type uint8  `json:"type" cbor:"0,keyasint"`
	Name string `json:"name" cbor:"1,keyasint"`
	Id   string `json:"id"   cbor:"2,keyasint"`
}

type TableGridData struct {
	Rows    []TableRowData    `json:"rows"     cbor:"0,keyasint"`
	Columns []TableColumnData `json:"columns"  cbor:"1,keyasint"`
}

func newTableGridData(columnId string) *TableGridData {
	rowData := TableRowData{}
	rowData[columnId] = ""

	return &TableGridData{
		Rows: []TableRowData{rowData},
		Columns: []TableColumnData{
			{Key: columnId, Label: "Column", Type: 2 /*TableDataType.TEXT*/},
		},
	}
}

// implements: cbor.Marshaler, cbor.Unmarshaler
type TableRowData map[string]any
type TableColumnData struct {
	Key            string              `json:"key"                      cbor:"0,keyasint"`
	Label          string              `json:"label"                    cbor:"1,keyasint"`
	Type           uint8               `json:"type"                     cbor:"2,keyasint"`
	AdditionalData TableAdditionalData `json:"additionalData,omitempty" cbor:"3,keyasint,omitempty"`
}

type TableAdditionalData struct {
	Tags []common.TagData `json:"tags,omitempty" cbor:"0,keyasint,omitempty"`
}

type TableUpdateOption struct {
	Title string         `json:"title,omitempty"`
	Tabs  []TableTabData `json:"tabs,omitempty"`
}
