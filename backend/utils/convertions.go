package utils

import (
	"strconv"
)

// Takes a string that looks like a number and turns it into a real number.
// Returns the number that the string represents.
//
// Note: If the string isn't a number, it will panic.
//
// Parameters:
//   - someString: The string that you want to turn into a number.
func StringToInt(someString string) int {
	result, convertError := strconv.Atoi(someString)
	if convertError != nil {
		panic(convertError)
	}
	return result
}

// Takes a number (someInt) and turns it into a string.
//
// Returns the string that represents the number.
//
// Parameters:
//   - someInt: The number you want to turn into a string.
func IntToString(someInt int) string {
	return strconv.Itoa(someInt)
}

// Takes a bunch of bytes (like pieces of data) and turns them into a string.
//
// Returns the string made from the pieces of data.
//
// Parameters:
//   - bytes: The pieces of data you want to turn into a string.
func BytesToString(bytes []byte) string {
	return string(bytes[:])
}
