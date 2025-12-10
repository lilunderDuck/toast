package editor

import "toast/backend/utils"

type TableMetadata struct {
	Title string         `json:"title" cbor:"0,keyasint"`
	Id    string         `json:"id"    cbor:"1,keyasint"`
	Tabs  []TableTabData `json:"tabs"  cbor:"2,keyasint"`
}

func newTableMetadata() *TableMetadata {
	defaultTabs := []TableTabData{
		{Type: 0 /*table view*/, Name: "Table view", Id: utils.GetRandomStringWithinLength(5)},
	}

	return &TableMetadata{
		Title: "Untitled",
		Id:    utils.GetRandomStringWithinLength(5),
		Tabs:  defaultTabs,
	}
}

type TableTabData struct {
	Type uint8  `json:"type" cbor:"0,keyasint"`
	Name string `json:"name" cbor:"1,keyasint"`
	Id   string `json:"id" cbor:"2,keyasint"`
}

type TableGridData struct {
	Rows    []RowData    `json:"rows"     cbor:"0,keyasint"`
	Columns []ColumnData `json:"columns"  cbor:"1,keyasint"`
}

func newTableGridData() *TableGridData {
	columnId := utils.GetRandomStringWithinLength(5)
	rowData := RowData{}
	rowData[columnId] = ""

	return &TableGridData{
		Rows: []RowData{rowData},
		Columns: []ColumnData{
			{Key: columnId, Label: "Column", Type: 2 /*TableDataType.TEXT*/},
		},
	}
}

type RowData map[string]any
type ColumnData struct {
	Key            string `json:"key"                      cbor:"0,keyasint"`
	Label          string `json:"label"                    cbor:"1,keyasint"`
	Type           uint8  `json:"type"                     cbor:"2,keyasint"`
	AdditionalData any    `json:"additionalData,omitempty" cbor:"3,keyasint,omitempty"`
}

type TableUpdateOption struct {
	Title string         `json:"title,omitempty"`
	Tabs  []TableTabData `json:"tabs,omitempty"`
}
