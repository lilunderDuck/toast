//go:build production
// +build production

package debug

// LogDebug does nothing in production builds
func Info(msg string, stuff ...any) {
	// ... empty ...
}

// LogInfo does nothing in production builds
func InfoLabel(msg string, stuff ...any) {
	// ... empty ...
}
