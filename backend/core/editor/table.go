package editor

import (
	"os"
	"toast/backend/internals"
	"toast/backend/utils"
)

var tablePaths = internals.NewTablePathsManager()

func (*Exports) CreateTable() (*TableMetadata, error) {
	data := newTableMetadata()

	if err := utils.BSON_WriteFile(tablePaths.MetaFile(data.Id), data); err != nil {
		return nil, err
	}

	defaultColumnId := data.Tabs[0].Id

	if err := utils.BSON_WriteFile(
		tablePaths.TableDataFile(data.Id, defaultColumnId),
		newTableGridData(defaultColumnId),
	); err != nil {
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

func (*Exports) DeleteTable(tableId string) error {
	return os.Remove(tablePaths.Base(tableId))
}

func (table *Exports) CreateTableGrid(tableId, tableGridId string) (*TableGridData, error) {
	newData := newTableGridData(tableGridId)
	if err := table.UpdateTableGrid(tableId, tableGridId, *newData); err != nil {
		return nil, err
	}

	return newData, nil
}

func (*Exports) GetTableGrid(tableId, tableGridId string) (*TableGridData, error) {
	return utils.BSON_ReadFile[TableGridData](tablePaths.TableDataFile(tableId, tableGridId))
}

func (*Exports) UpdateTableGrid(tableId, tableGridId string, data TableGridData) error {
	return utils.BSON_WriteFile(tablePaths.TableDataFile(tableId, tableGridId), data)
}
