package file_dialog

import "github.com/sqweek/dialog"

func OpenFileDialog(options *FileDialogOptions) (string, error) {
	fileDialog := dialog.File().Title(options.Title)

	if len(options.Filters) > 0 {
		for _, filter := range options.Filters {
			fileDialog.Filter(filter.Name, filter.Extension)
		}
	}

	return fileDialog.Load()
}
