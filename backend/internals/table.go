package internals

import (
	"path/filepath"
)

type TablePathsManager struct {
	basePath string
}

func NewTablePathsManager() *TablePathsManager {
	return &TablePathsManager{
		basePath: filepath.Join(DATA_FOLDER_PATH, "table"),
	}
}

func (path *TablePathsManager) Base(tableId string) string {
	return filepath.Join(path.basePath, tableId)
}

func (path *TablePathsManager) MetaFile(tableId string) string {
	return filepath.Join(path.Base(tableId), "meta.dat")
}

func (path *TablePathsManager) TableDataFile(tableId string, tableFileId string) string {
	return filepath.Join(path.Base(tableId), tableFileId+".dat")
}
