//go:build !production
// +build !production

package debug

import (
	"os"
	"time"

	"github.com/charmbracelet/log"
)

var logger = log.NewWithOptions(os.Stderr, log.Options{
	ReportTimestamp: true,
	TimeFormat:      time.Kitchen,
})

func Info(msg string, stuff ...any) {
	if len(stuff) == 0 {
		logger.Info(msg)
	} else {
		logger.Info(msg, stuff...)
	}
}

func Infof(msg string, stuff ...any) {
	logger.Infof(msg, stuff...)
}

func Err(msg any, stuff ...any) {
	if len(stuff) == 0 {
		logger.Error(msg)
	} else {
		logger.Error(msg, stuff)
	}
}
