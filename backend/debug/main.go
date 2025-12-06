package debug

import (
	"os"
	"time"

	"github.com/charmbracelet/log"
)

var logger = log.NewWithOptions(os.Stdout, log.Options{
	ReportTimestamp: true,
	TimeFormat:      time.Kitchen,
})

func Logf(something string, formater ...any) {
	logger.Logf(log.InfoLevel, something, formater...)
}

func Warnf(something string, formater ...any) {
	logger.Logf(log.WarnLevel, something, formater...)
}

func Errf(something string, formater ...any) {
	logger.Logf(log.ErrorLevel, something, formater...)
}

func Log(something string, keyvals ...any) {
	logger.Info(something, keyvals...)
}

func Warn(something string, keyvals ...any) {
	logger.Warn(something, keyvals...)
}

func Err(someError error, keyvals ...any) {
	logger.Error(someError.Error(), keyvals...)
}
