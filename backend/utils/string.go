package utils

import (
	"strconv"
	"strings"

	lzstring "github.com/daku10/go-lz-string"
)

func StringContains(testString string, prefix string) bool {
	return strings.HasPrefix(testString, prefix)
}

func ToString(anyThing int) string {
	return strconv.Itoa(anyThing)
}

const NULL_CHAR = "\000"

func MustCompressString(inputString string) []uint16 {
	compressed, err := lzstring.Compress(inputString)
	if err != nil {
		panic(err)
	}

	return compressed
}

func MustDecompressString(compressedString []uint16) string {
	decompressed, err := lzstring.Decompress(compressedString)
	if err != nil {
		panic(err)
	}

	return decompressed
}

func CompressStrings(inputStrings ...string) []uint16 {
	return MustCompressString(strings.Join(inputStrings, NULL_CHAR))
}

func DecompressStrings(compressedString []uint16) []string {
	return strings.Split(MustDecompressString(compressedString), NULL_CHAR)
}
