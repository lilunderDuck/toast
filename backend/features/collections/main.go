package collections

import (
	"path/filepath"
	"toast/backend/core/internals"
	"toast/backend/debug"
	"toast/backend/features/collections/gallery"
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
	if playlist.IsValidStructure(targetPath) {
		return COLLECTION_TYPE__PLAYLIST
	}

	if gallery.IsValidStructure(targetPath) {
		return COLLECTION_TYPE__GALLERY
	}

	return COLLECTION_TYPE__INVALID
}

func (*Exports) Collections_createExternal(targetPath string) (*CollectionExternalSourceData, error) {
	data := CollectionExternalSourceData{
		CollectionPath: targetPath,
	}

	cachedIconPath := ""

	if gallery.IsValidStructure(targetPath) {
		galleryData, err := gallery.ReadMetadata(targetPath)
		if err != nil {
			return nil, err
		}

		cachedIconPath, err = utils.CopyFile(
			filepath.Join(targetPath, "icons", galleryData.Icon),
			internals.CACHE_FOLDER_PATH,
		)

		if err != nil {
			return nil, err
		}

		data.Id = galleryData.Id
		data.Name = galleryData.Name
		data.Type = COLLECTION_TYPE__GALLERY
		data.Icon = filepath.Base(cachedIconPath)
	}

	return &data, nil
}

type CollectionExternalAvailabilityMap map[string]bool

func (this *Exports) Collections_checkExternalAvailability() (*CollectionExternalAvailabilityMap, error) {
	data, err := this.Collections_getAll()
	if err != nil {
		return nil, err
	}

	result := make(CollectionExternalAvailabilityMap)
	if len(data.ExternalSources) == 0 {
		return &result, nil
	}

	for _, externalCollection := range data.ExternalSources {
		isAvailable := utils.IsDirectoryExist(externalCollection.CollectionPath)
		if debug.DEBUG_MODE {
			debug.InfoLabelf("collections", "Is %s available?: %t", debug.FormatPath(externalCollection.CollectionPath), isAvailable)
		}

		result[externalCollection.Id] = isAvailable
	}

	return &result, nil
}

func (this *Exports) Collections_isExternalCollectionAvailable(path string) bool {
	return utils.IsDirectoryExist(path)
}
