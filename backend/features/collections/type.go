package collections

import (
	"toast/backend/features/collections/gallery"
	"toast/backend/features/collections/playlist"
)

type CollectionsData struct {
	Playlists       []playlist.PlaylistData        `json:"playlists"`
	Galleries       []gallery.GalleryData          `json:"galleries"`
	ExternalSources []CollectionExternalSourceData `json:"externalSources"`
}

type CollectionExternalSourceData struct {
	Name           string         `json:"name"`
	Icon           string         `json:"icon"`
	CollectionPath string         `json:"collectionPath"`
	Id             string         `json:"id"`
	Type           CollectionType `json:"type"`
}
