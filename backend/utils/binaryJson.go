package utils

import (
	"fmt"

	"github.com/fxamacker/cbor/v2"
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
	binaryData, encodeError := cbor.Marshal(anyObject)
	if encodeError != nil {
		fmt.Println("BSON encode error", encodeError)
		return encodeError
	}

	writeError := WriteFile(path, binaryData)
	if writeError != nil {
		return writeError
	}

	return nil
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
func BSON_ReadFile(path string, out any) (someError error) {
	dataFromDisk, readError := ReadFile(path)
	println("does it crash here? 2")
	if readError != nil {
		return readError
	}

	println("does it crash here? 3")
	decodeError := cbor.Unmarshal(dataFromDisk, out)
	println("does it crash here? 4")
	if decodeError != nil {
		fmt.Println("BSON decode error", decodeError)
		return decodeError
	}
	println("does it crash here? 5")

	return nil
}
