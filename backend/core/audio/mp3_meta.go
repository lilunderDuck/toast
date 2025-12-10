package audio

import (
	"os"

	"github.com/dhowden/tag"
)

func mp3_readTag(filePath string) (tag.Metadata, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	metadata, err := tag.ReadFrom(f)
	if err != nil {
		return nil, err
	}

	return metadata, nil
}
