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

func LogLabelf(label string, something string, formater ...any) {
	logger.SetPrefix(label)
	logger.Logf(log.InfoLevel, something, formater...)
	logger.SetPrefix("")
}

func WarnLabelf(label string, something string, formater ...any) {
	logger.SetPrefix(label)
	logger.Logf(log.WarnLevel, something, formater...)
	logger.SetPrefix("")
}

func ErrLabelf(label string, something string, formater ...any) {
	logger.SetPrefix(label)
	logger.Logf(log.ErrorLevel, something, formater...)
	logger.SetPrefix("")
}

func LogLabel(label string, something string) {
	logger.SetPrefix(label)
	logger.Log(log.InfoLevel, something)
	logger.SetPrefix("")
}

func WarnLabel(label string, something string) {
	logger.SetPrefix(label)
	logger.Log(log.WarnLevel, something)
	logger.SetPrefix("")
}

func ErrLabel(label string, something error, stuff ...any) {
	logger.SetPrefix(label)
	logger.Log(log.ErrorLevel, something, stuff...)
	logger.SetPrefix("")
}
