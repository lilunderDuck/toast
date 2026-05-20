package debug

import (
	"fmt"
	"path/filepath"
	"strconv"
	"strings"
)

func FormatWith(color, style, something string) string {
	return fmt.Sprintf("%s%s%s%s", color, style, something, COLOR_RESET)
}

func formatLabel(name string) string {
	// %-x.xs
	// -:  Pad on the right
	// x:  Minimum width of x
	// .x: Maximum width (precision) of x
	format := "%-" + fmt.Sprintf("%d.%ds", LABEL_MAX_LENGTH, LABEL_MAX_LENGTH)
	return FormatWith(COLOR_GRAY, STYLE_NONE, fmt.Sprintf(format, name))
}

func formatContent(content string) string {
	return strings.ReplaceAll(content, "\n", "\n                | ")
}

func FormatPath(somePath string) string {
	if somePath == "" {
		return FormatWith(COLOR_GRAY, "", "[empty string]")
	}

	if somePath == "/" {
		return FormatWith(COLOR_GRAY, "", "/")
	}

	pathName := filepath.Dir(somePath)
	pathFileName := filepath.Base(somePath)
	return strings.ReplaceAll(
		fmt.Sprintf(
			"%s%s",
			FormatWith(COLOR_GRAY, "", pathName+"/"),
			FormatWith("", STYLE_BOLD, pathFileName),
		),
		"//",
		"/",
	)
}

type AnyNumber interface {
	int | int8 | int16 | int32 | int64 |
		uint | uint8 | uint16 | uint32 | uint64
}

func FormatNumbers[T AnyNumber](number T) string {
	return FormatWith(COLOR_GREEN, STYLE_NONE, strconv.Itoa(int(number)))
}

func FormatFilename(filename string) string {
	return FormatWith(COLOR_CYAN, STYLE_NONE, filename)
}

func FormatErrorName(errorName string) string {
	return FormatWith(COLOR_RED, STYLE_NONE, errorName)
}
