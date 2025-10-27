package backend

import (
	"context"
	"toast/backend/db"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
	// windowCount int
}

// Creates a new App application struct
func New() *App {
	return &App{}
}

// Called at application startup
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
}

// Called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	db.CloseAll()
	return false
}

// Called at application termination.
func (a *App) shutdown(ctx context.Context) {
}

// Close the window
//
// Why this method doesn't exist in the javascript side? huh-?
func (a *App) WindowClose() {
	runtime.Quit(a.ctx)
}

func (a *App) OpenDirectoryDialog(options runtime.OpenDialogOptions) (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, options)
}

func (a *App) OpenFileDialog(options runtime.OpenDialogOptions) (string, error) {
	return runtime.OpenFileDialog(a.ctx, options)
}

func (a *App) OpenMultipleFilesDialog(options runtime.OpenDialogOptions) ([]string, error) {
	return runtime.OpenMultipleFilesDialog(a.ctx, options)
}

// OpenNewWindow opens a new Wails window
func (a *App) OpenNewWindow(title string) error {
	return nil
}
