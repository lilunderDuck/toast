package editor

import (
	"toast/backend/core/audio"
	"toast/backend/internals"
	"toast/backend/utils"
)

var writePlaylist,
	readPlaylist,
	uploadToPlaylist,
	deletePlaylist = CreateEmbedableMediaCollection[PlaylistMetadata](internals.Media.Get("playlist"))

//

func (*Exports) CreatePlaylist(options PlaylistOptions) (*PlaylistMetadata, error) {
	data := newPlaylistMetadata(&options)

	if err := utils.BSON_WriteFile(tablePaths.MetaFile(data.Id), data); err != nil {
		return nil, err
	}

	return data, nil
}

func (*Exports) GetPlaylist(playlistId string) (*PlaylistMetadata, error) {
	return readPlaylist(playlistId)
}

func (editor *Exports) UpdatePlaylist(playlistId string, options PlaylistOptions) error {
	oldData, err := readPlaylist(playlistId)
	if err != nil {
		return err
	}

	if options.Title != "" {
		oldData.Title = options.Title
	}

	if options.Description != "" {
		oldData.Description = options.Title
	}

	if len(options.Items) != 0 {
		oldData.Items = options.Items
	}

	oldData.Modified = utils.GetCurrentDateNow()

	return writePlaylist(playlistId, oldData)
}

func (group *Exports) DeletePlaylist(playlistId string) error {
	return deletePlaylist(playlistId)
}

func (*Exports) CreatePlaylistItem(
	playlistId string,
	options PlaylistItemOptions,
) (*PlaylistItemData, error) {
	if err := uploadToPlaylist(playlistId, options.AudioFilePath); err != nil {
		return nil, err
	}

	audioDuration, err := audio.GetDuration(options.AudioFilePath)
	if err != nil {
		return nil, err
	}

	return NewPlaylistItemData(int(audioDuration), &options), nil
}

func (*Exports) GetAudioData(audioFilePath string) (*audio.Info, error) {
	return audio.GetInfo(audioFilePath)
}
