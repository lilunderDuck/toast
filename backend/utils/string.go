package utils

import (
	"strconv"
	"strings"

	lzstring "github.com/daku10/go-lz-string"
)

func ToString(anyThing int) string {
	return strconv.Itoa(anyThing)
}

// A special constant used as a separator when compressing and decompressing
// multiple strings to avoid conflicts with common characters.
//
// Notes: weird thing will happen if your string also contains this null character.
const NULL_CHAR = "\000"

// Compresses a single string using the lz-string algorithm.
// The function will `panic` if the compression fails
func MustCompressString(inputString string) []uint16 {
	compressed, err := lzstring.Compress(inputString)
	if err != nil {
		panic(err)
	}

	return compressed
}

// Decompresses a compressed string back into a string.
// The function will `panic` if the decompression fails
func MustDecompressString(compressedString []uint16) string {
	decompressed, err := lzstring.Decompress(compressedString)
	if err != nil {
		panic(err)
	}

	return decompressed
}

// Joins a variable number of strings using `NULL_CHAR` as a
// separator and then compresses the combined string.
func CompressStrings(inputStrings ...string) []uint16 {
	return MustCompressString(strings.Join(inputStrings, NULL_CHAR))
}

// Decompresses a compressed string and then splits the
// resulting string back into a slice of strings using `NULL_CHAR` as the delimiter.
func DecompressStrings(compressedString []uint16) []string {
	return strings.Split(MustDecompressString(compressedString), NULL_CHAR)
}
