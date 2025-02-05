package utils

import (
	"os"

	"github.com/fxamacker/cbor/v2"
)

func BSON_WriteFile(path string, anyObject any) error {
	binaryData, encodeError := cbor.Marshal(anyObject)
	if encodeError != nil {
		return encodeError
	}

	writeError := os.WriteFile(path, binaryData, 0666)
	if writeError != nil {
		return writeError
	}

	return nil
}

func BSON_ReadFile(path string, out interface{}) error {
	dataFromDisk, readError := os.ReadFile(path)
	if readError != nil {
		return readError
	}

	decodeError := cbor.Unmarshal(dataFromDisk, out)
	if decodeError != nil {
		return decodeError
	}

	return nil
}
