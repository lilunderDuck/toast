package utils

import (
	"encoding/json"
	"strconv"
)

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

func BytesToString(bytes []byte) string {
	return string(bytes[:])
}

func MapToBinJSON(anyMap map[string]any) []byte {
	json, encodeError := json.Marshal(anyMap)
	if encodeError != nil {
		panic(encodeError)
	}

	return json
}
