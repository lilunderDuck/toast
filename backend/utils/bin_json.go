package utils

import (
	"os"
	"path/filepath"
	"toast/backend/debug"

	"github.com/fxamacker/cbor/v2"
	// "github.com/klauspost/compress/zstd"
)

// Takes any kind of data (anyObject) and saves it to a file.
// It uses a special way to store the data (called CBOR) which makes it easy to read later.
//
// Parameters:
//   - path: The location where you want to save the file.
//   - anyObject: The data you want to save.
//
// Returns:
//   - An error if something went wrong while saving, or nil if it saved correctly.
func BSON_WriteFile(path string, anyObject any) (someError error) {
	dirToTheFile := filepath.Dir(path)
	if !IsDirectoryExist(dirToTheFile) {
		CreateDirectory(dirToTheFile)
	}

	binaryData, err := cbor.Marshal(anyObject)
	if debug.DEBUG_MODE {
		debug.Logf("BSON write: %s", path)
	}

	if err != nil {
		return err
	}

	return WriteFile(path, binaryData)
}

// Reads data from a file that was saved using BSON_WriteFile.
// It puts the data into a variable (out) that you give it.
//
// Parameters:
//   - path: The location of the file you want to read.
//   - out: A variable where the data from the file will be stored.
//
// Returns:
//   - An error if something went wrong while reading, or nil if it read correctly.
func base_BSON_ReadFile(path string) (dataOut []byte, someError error) {
	dataFromDisk, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	return dataFromDisk, nil
}

func BSON_ReadFile[T any](path string) (*T, error) {
	if debug.DEBUG_MODE {
		debug.Logf("BSON read: %s", path)
	}

	data, err := base_BSON_ReadFile(path)
	if err != nil {
		return nil, err
	}
	return BSON_Unmarshal[T](data)
}

func BSON_Unmarshal[T any](in []byte) (*T, error) {
	var out T
	err := cbor.Unmarshal(in, &out)
	return &out, err
}
