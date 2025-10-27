package internals

import (
	"fmt"
)

type EmbedableMediaPath struct {
	MediaFile string
	Path      string
}

func (path *EmbedableMediaPath) GetMetaFilePath(id int) string {
	return fmt.Sprintf(path.Path, DATA_FOLDER_PATH, id)
}

func (path *EmbedableMediaPath) GetFilePath(id int) string {
	return fmt.Sprintf(path.Path, MEDIA_FOLDER_PATH, id)
}

type EmbedableMediaPathMapping map[string]EmbedableMediaPath

func (EmbedableMediaPathMapping) Get(what string) *EmbedableMediaPath {
	path := Media[what]
	return &path
}

var Media = EmbedableMediaPathMapping{
	"gallery": EmbedableMediaPath{
		MediaFile: `%s/g-%d.dat`,
		Path:      `%s/gallery/%d`,
	},
	"playlist": EmbedableMediaPath{
		MediaFile: `%s/p-%d.dat`,
		Path:      `%s/playlist/%d`,
	},
}
