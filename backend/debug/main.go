// A custom logging library to log stuff into the console in dev mode.
//
// Notes: to make sure everything in this library does not include in the final build, or
// there's a specific code that you want to **only be run in dev mode**,
// make sure to warp it with
//
//	if debug.DEBUG_MODE {
//	  // ... your code here ...
//	}
package debug

import (
	"fmt"
	"os"
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

func InfoLabelf(label string, something string, formater ...any) {
	InfoLabel(label, fmt.Sprintf(something, formater...))
}

func WarnLabelf(label string, something string, formater ...any) {
	WarnLabel(label, fmt.Sprintf(something, formater...))
}

func ErrLabelf(label string, something string, formater ...any) {
	fmt.Printf("%s %s | %s\n", formatLabel(label), LOG_LABEL_ERROR, formatContent(fmt.Sprintf(something, formater...)))
}
