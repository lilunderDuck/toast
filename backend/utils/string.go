package utils

import (
	"strconv"
	"strings"
)

func StringContains(testString string, prefix string) bool {
	return strings.HasPrefix(testString, prefix)
}

func ToString(anyThing int) string {
	return strconv.Itoa(anyThing)
}
