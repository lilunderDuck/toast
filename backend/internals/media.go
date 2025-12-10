package internals

import (
	"fmt"
)

type EmbedableMediaPath struct {
	MetaFile string
	Path     string
}

func (path *EmbedableMediaPath) GetMetaFilePath(id string) string {
	return fmt.Sprintf(path.MetaFile, DATA_FOLDER_PATH, id)
}

func (path *EmbedableMediaPath) GetFolderPath(id string) string {
	return fmt.Sprintf(path.Path, MEDIA_FOLDER_PATH, id)
}

type EmbedableMediaPathMapping map[string]EmbedableMediaPath

func (EmbedableMediaPathMapping) Get(what string) *EmbedableMediaPath {
	path := Media[what]
	return &path
}

var Media = EmbedableMediaPathMapping{
	"gallery": EmbedableMediaPath{
		MetaFile: `%s/gallery/%s.dat`,
		Path:     `%s/gallery/%s`,
	},
	"playlist": EmbedableMediaPath{
		MetaFile: `%s/playlist/%s.dat`,
		Path:     `%s/playlist/%s`,
	},
}
