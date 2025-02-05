package utils

import "strconv"

func StringToInt(someString string) int {
	result, convertError := strconv.Atoi(someString)
	if convertError != nil {
		panic(convertError)
	}
	return result
}

func IntToString(someInt int) string {
	return strconv.Itoa(someInt)
}
