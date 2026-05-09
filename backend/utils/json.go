package utils

import (
	"encoding/json"
	"os"
)

func ParseJson[T any](jsonByteData []byte) (T, error) {
	var out T
	err := json.Unmarshal(jsonByteData, &out)
	return out, err
}

func ParseJsonString[T any](jsonString string) (T, error) {
	var out T
	err := json.Unmarshal([]byte(jsonString), &out)
	return out, err
}

func StringifyJson(anyJson any) string {
	rawData, err := json.Marshal(anyJson)
	if err != nil {
		panic("Not a json data")
	}

	return string(rawData)
}

func WriteJsonFile(path string, anyJson any) error {
	rawData, err := json.Marshal(anyJson)
	if err != nil {
		return err
	}

	return os.WriteFile(path, rawData, 0667)
}
