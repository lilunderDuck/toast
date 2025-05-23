package file_dialog

import (
	"burned-toast/backend/debug"

	"github.com/sqweek/dialog"
)

func OpenFileDialog(options *FileDialogOptions) (string, error) {
	fileDialog := dialog.File().Title(options.Title)

	if len(options.Filters) > 0 {
		for _, filter := range options.Filters {
			fileDialog.Filter(filter.Name, filter.Extension)
		}
	}

	debug.Info("File dialog will show with options:", "options", options)
	path, err := fileDialog.Load()
	if err != nil {
		debug.Err(err)
	}

	return path, err
}
