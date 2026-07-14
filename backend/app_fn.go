package backend

import (
	"context"
	"runtime"
	"time"
	"toast/backend/debug"
	"toast/backend/features/app_storage"

	"github.com/shirou/gopsutil/cpu"
	wails_runtime "github.com/wailsapp/wails/v2/pkg/runtime"
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
	if debug.DEBUG_MODE {
		debug.InfoLabelf("app", "closing app now...")
	}

	app_storage.OnShutdown()
	wails_runtime.EventsEmit(ctx, "before_closing")
	return false
}

// Called at application termination.
func (a *App) shutdown(ctx context.Context) {
}

// Close the window
//
// Why this method doesn't exist in the javascript side? huh-?
func (a *App) WindowClose() {
	wails_runtime.Quit(a.ctx)
}

func (a *App) OpenDirectoryDialog(options wails_runtime.OpenDialogOptions) (string, error) {
	return wails_runtime.OpenDirectoryDialog(a.ctx, options)
}

func (a *App) OpenFileDialog(options wails_runtime.OpenDialogOptions) (string, error) {
	return wails_runtime.OpenFileDialog(a.ctx, options)
}

func (a *App) OpenMultipleFilesDialog(options wails_runtime.OpenDialogOptions) ([]string, error) {
	return wails_runtime.OpenMultipleFilesDialog(a.ctx, options)
}

// OpenNewWindow opens a new Wails window
func (a *App) OpenNewWindow(title string) error {
	return nil
}

type AppUsage struct {
	AllocatedMB   uint64  `json:"allocatedMB"`
	TotalHeapSize uint64  `json:"totalHeapSize"`
	CpuUsage      float64 `json:"cpuUsage"`
}

func (a *App) GetCurrentAppUsage() AppUsage {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	percentage, err := cpu.PercentWithContext(a.ctx, time.Second, false)
	cpuUsage := float64(0)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.WarnLabelf("app", "could not get the current cpu usage:\n%v", err)
		}

		cpuUsage = 0
	} else {
		cpuUsage = percentage[0]
	}

	if debug.DEBUG_MODE {
		debug.InfoLabelf("app", "heap allocated: %d MB, total heap: %d MB, cpu: %f%%", m.Alloc/1024/1024, m.HeapSys/1024/1024, cpuUsage)
	}

	return AppUsage{
		AllocatedMB:   m.Alloc / 1024 / 1024,
		TotalHeapSize: m.HeapSys / 1024 / 1024,
		CpuUsage:      cpuUsage,
	}
}
