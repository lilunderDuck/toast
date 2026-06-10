package collections

import (
	"toast/backend/debug"
	"toast/backend/features/collections/playlist"
	"toast/backend/utils"
)

type Exports struct{}

func (collection *Exports) Collections_getAll() (CollectionsData, error) {
	if debug.DEBUG_MODE {
		debug.InfoLabel("collections", "getting all collections data...")
	}

	return utils.ReadJsonFile[CollectionsData](allCollectionsJsonData)
}

func (collection *Exports) Collections_update(newData CollectionsData /*partial*/) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("collections", "updating collections, data is: %#v", newData)
	}

	data, err := collection.Collections_getAll()
	if err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabel("collections", err)
		}
		return nil
	}

	mergeCollectionsData(&data, newData)
	return utils.WriteJsonFile(allCollectionsJsonData, data)
}

func (collection *Exports) Collections_updatePlaylistById(id string, newData playlist.PlaylistData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("collections", "[playlist] updating %s...", id)
	}

	data, err := collection.Collections_getAll()
	if err != nil {
		if debug.DEBUG_MODE {
			debug.ErrLabel("collections", err)
		}
		return nil
	}

	playlistData := data.Playlists
	for i := range playlistData {
		if playlistData[i].Id == id {
			data := playlistData[i]                    // temp save the found data
			playlist.MergePlaylistData(&data, newData) // merging old data with new data
			playlistData[i] = data                     // store new data
			break
		}
	}

	data.Playlists = playlistData // update the data

	return utils.WriteJsonFile(allCollectionsJsonData, data)
}

type CollectionType byte

const (
	COLLECTION_TYPE__PLAYLIST        CollectionType = 0
	COLLECTION_TYPE__GALLERY         CollectionType = 1
	COLLECTION_TYPE__EXTERNAL_SOURCE CollectionType = 254
	COLLECTION_TYPE__INVALID         CollectionType = 255
)

func (*Exports) Collections_judgeTypeByPath(targetPath string) CollectionType {
	hasMetadataFiles :=
		utils.IsFileExist(targetPath+"/entries.json") &&
			utils.IsFileExist(targetPath+"/meta.json")
	isPlaylistFolderStructure :=
		utils.IsDirectoryExist(targetPath+"/icons") &&
			utils.IsDirectoryExist(targetPath+"/tracks")
	if hasMetadataFiles && isPlaylistFolderStructure {
		return COLLECTION_TYPE__PLAYLIST
	}

	isGalleryFolderStructure := utils.IsDirectoryExist(targetPath + "/entry")

	if hasMetadataFiles && isGalleryFolderStructure {
		return COLLECTION_TYPE__GALLERY
	}

	return COLLECTION_TYPE__INVALID
}
