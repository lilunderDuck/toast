package debug

import (
	"fmt"
	"os"
	"time"

	"github.com/charmbracelet/log"
)

func InfoLabel(label string, something string) {
	fmt.Printf("%s %s | %s\n", formatLabel(label), LOG_LABEL_INFO, formatContent(something))
}

func WarnLabel(label string, something string) {
	fmt.Printf("%s %s | %s\n", formatLabel(label), LOG_LABEL_WARN, formatContent(something))
}

func ErrLabel(label string, detail error) {
	fmt.Printf("%s %s | %s\n", formatLabel(label), LOG_LABEL_ERROR, formatContent(detail.Error()))
}

func FatalLabel(label string, detail error) {
	fmt.Printf("%s %s | %s\n", formatLabel(label), LOG_LABEL_FATAL, formatContent(detail.Error()))
	os.Exit(1)
}

var logger = log.NewWithOptions(os.Stdout, log.Options{
	ReportTimestamp: true,
	TimeFormat:      time.Kitchen,
})

func InfoLabelf(label string, something string, formater ...any) {
	InfoLabel(label, fmt.Sprintf(something, formater...))
}

func WarnLabelf(label string, something string, formater ...any) {
	WarnLabel(label, fmt.Sprintf(something, formater...))
}

func ErrLabelf(label string, something string, formater ...any) {
	fmt.Printf("%s %s | %s\n", formatLabel(label), LOG_LABEL_ERROR, formatContent(fmt.Sprintf(something, formater...)))
}
