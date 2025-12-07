package table

import (
	"os"
	"toast/backend/internals"
	"toast/backend/utils"
)

// Reuse this function
var tablePaths = internals.NewTablePathsManager()

type Exports struct{}

func (*Exports) CreateTable() (*TableMetadata, error) {
	data := newTableMetadata()

	if err := utils.BSON_WriteFile(tablePaths.MetaFile(data.Id), data); err != nil {
		return nil, err
	}

	return data, nil
}

func (*Exports) GetTable(tableId string) (*TableMetadata, error) {
	return utils.BSON_ReadFile[TableMetadata](tablePaths.MetaFile(tableId))
}

func (*Exports) UpdateTable(tableId string, newData TableUpdateOption) error {
	data, err := utils.BSON_ReadFile[TableMetadata](tablePaths.MetaFile(tableId))
	if err != nil {
		return err
	}

	if len(newData.Tabs) != 0 {
		data.Tabs = newData.Tabs
	}

	if newData.Title != "" {
		data.Title = newData.Title
	}

	return utils.BSON_WriteFile(tablePaths.MetaFile(tableId), data)
}

func (*Exports) DeleteTable(tableId string) {
	os.Remove(tablePaths.Base(tableId))
}

func (table *Exports) CreateTableGrid(tableId, tableGridId string) *TableGridData {
	newData := newTableGridData()
	table.UpdateTableGrid(tableId, tableGridId, *newData)

	return newData
}

func (*Exports) GetTableGrid(tableId, tableGridId string) *TableGridData {
	data, err := utils.BSON_ReadFile[TableGridData](tablePaths.TableDataFile(tableId, tableGridId))
	if err != nil {
		return newTableGridData()
	}

	return data
}

func (*Exports) UpdateTableGrid(tableId, tableGridId string, data TableGridData) {
	utils.BSON_WriteFile(tablePaths.TableDataFile(tableId, tableGridId), data)
}
