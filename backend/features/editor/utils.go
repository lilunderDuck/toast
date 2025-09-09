package editor

import (
	"fmt"
	"path/filepath"
	"strings"
	"toast/backend/utils"

	lzstring "github.com/daku10/go-lz-string"
	"github.com/wailsapp/mimetype"
)

const (
	FILE_TYPE__DEFAULT uint8 = 0
	FILE_TYPE__ERROR   uint8 = 255
	FILE_TYPE__IMAGE   uint8 = 1
	FILE_TYPE__VIDEO   uint8 = 2
	FILE_TYPE__TEXT    uint8 = 3
	FILE_TYPE__AUDIO   uint8 = 4
)

var mimeTypeMapping = map[string]uint8{
	"image": FILE_TYPE__IMAGE,
	"video": FILE_TYPE__VIDEO,
	"text":  FILE_TYPE__TEXT,
	"audio": FILE_TYPE__AUDIO,
}

// Determime a file type based on their MIME type, if it encounter
// an unknown file type, it returns FILE_TYPE__DEFAULT.
//
// Usually it will work most of the time, however the error will be returned
// if there is any issue in opening and reading from the input file.
func determineFileType(filePath string) (uint8, error) {
	mimeType, err := mimetype.DetectFile(filePath)
	if err != nil {
		return FILE_TYPE__ERROR, err
	}

	// mime type usaually starts with [type]/[sub type]
	// example:
	//    text/plain   -   a text file
	//    image/gif    -   a gif file
	//    ...
	mimeTypeStr := strings.Split(mimeType.String(), "/")
	switch mimeTypeStr[0] {
	case "application":
		switch mimeTypeStr[1] {
		case "json":
			return FILE_TYPE__TEXT, nil
		default:
			// incase I need to handle other cases that I miss
			fmt.Printf("Unknown subtype \"%s\", using default file type: %d\n", mimeTypeStr[1], FILE_TYPE__DEFAULT)
			return FILE_TYPE__DEFAULT, nil
		}
		// <- default: get file type from a mapping instead
	}

	fileType, ok := mimeTypeMapping[mimeTypeStr[0]]
	if !ok {
		fmt.Printf("Type %s does not exist in the mapping\n", mimeTypeStr[0])
		fileType = FILE_TYPE__DEFAULT
	}

	return fileType, nil
}

func uploadFile(location, filePath string) error {
	fileName := filepath.Base(filePath)
	newSavedLocation := filepath.Join(location, fileName)

	// Adds some random string after the file name if the location the file will be saved
	// have the same file name.
	if utils.IsFileExist(newSavedLocation) {
		newSavedLocation = utils.RenameFileInPath(newSavedLocation, func(oldFilename string) string {
			return fmt.Sprintf("%s_%s", oldFilename, utils.GetRandomStringWithinLength(4))
		})
	}

	return utils.CopyFile(filePath, newSavedLocation)
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
