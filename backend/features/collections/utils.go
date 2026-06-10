package collections

import (
	"toast/backend/core/internals"
	"toast/backend/utils"
)

var (
	CollectionsFolder      = internals.DATA_FOLDER_PATH + "/collections"
	allCollectionsJsonData = internals.DATA_FOLDER_PATH + "/collections/all.json"
)

func mergeCollectionsData(data *CollectionsData, newData CollectionsData) {
	if len(newData.ExternalSources) != 0 {
		data.ExternalSources = newData.ExternalSources
	}

	if len(newData.Galleries) != 0 {
		data.Galleries = newData.Galleries
	}

	if len(newData.Playlists) != 0 {
		data.Playlists = newData.Playlists
	}
}

func ReadCollectionsData() (CollectionsData, error) {
	return utils.ReadJsonFile[CollectionsData](allCollectionsJsonData)
}
