package editor

import (
	"os"
	"strings"
	"toast/backend/debug"
	"toast/backend/internals"
	"toast/backend/utils"

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
func DetermineFileType(filePath string) (uint8, error) {
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
			if debug.DEBUG_MODE {
				debug.Errf("Unknown subtype \"%s\", using default file type: %d\n", mimeTypeStr[1], FILE_TYPE__DEFAULT)
			}
			return FILE_TYPE__DEFAULT, nil
		}
		// <- default: get file type from a mapping instead
	}

	fileType, ok := mimeTypeMapping[mimeTypeStr[0]]
	if !ok {
		if debug.DEBUG_MODE {
			debug.Errf("Type %s does not exist in the mapping\n", mimeTypeStr[0])
		}
		fileType = FILE_TYPE__DEFAULT
	}

	return fileType, nil
}

// function type and stuff to make sure I don't waste time retyping
// the whole thing

type embed_writeMetaFn[T any] func(id string, data *T) error
type embed_readMetaFn[T any] func(id string) (*T, error)
type embed_uploadFn[T any] func(id string, from string) error
type embed_deleteFn func(id string) error

func CreateEmbedableMediaCollection[T any](
	manager *internals.EmbedableMediaPath,
) (embed_writeMetaFn[T], embed_readMetaFn[T], embed_uploadFn[T], embed_deleteFn) {
	// what in the hell did I just write...
	var writeFn embed_writeMetaFn[T] = func(id string, data *T) error {
		return utils.BSON_WriteFile(manager.GetMetaFilePath(id), data)
	}

	var readFn embed_readMetaFn[T] = func(id string) (*T, error) {
		return utils.BSON_ReadFile[T](manager.GetMetaFilePath(id))
	}

	var uploadFn embed_uploadFn[T] = func(id string, from string) error {
		return utils.CopyFile(from, manager.GetFolderPath(id))
	}

	var deleteFn embed_deleteFn = func(id string) error {
		return os.Remove(manager.GetFolderPath(id))
	}

	return writeFn, readFn, uploadFn, deleteFn
}
