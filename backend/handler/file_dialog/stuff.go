package file_dialog

type FileDialogFilter struct {
	Name      string `form:"name"        json:"name"`
	Extension string `form:"extension"   json:"extension"`
}

type FileDialogOptions struct {
	Title   string             `form:"title"              json:"title"`
	Filters []FileDialogFilter `form:"filters,omitempty"  json:"filters,omitempty"`
}
