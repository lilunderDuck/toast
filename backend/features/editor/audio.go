package editor

import (
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

func (*EditorExport) CreatePlaylist(options PlaylistOptions) (*PlaylistMetadata, error) {
	playlistId := utils.GetRandomIntWithinLength(16)
	data := &PlaylistMetadata{
		Title:       options.Title,
		Description: options.Description,
		Id:          playlistId,
		Items:       []PlaylistItemData{},
	}

	err := utils.BSON_WriteFile(
		internals.AudioPlaylistMetadataPath(playlistId),
		data,
	)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func (*EditorExport) UploadAudioToPlaylist(playlistId int, options PlaylistItemOptions) error {
	return uploadFile(internals.AudioPlaylistPath(playlistId), options.Path)
}

func (*EditorExport) UpdatePlaylistData(playlistId int, options PlaylistOptions) error {
	var oldData PlaylistMetadata
	if err := utils.BSON_ReadFile(
		internals.AudioPlaylistMetadataPath(playlistId),
		&oldData,
	); err != nil {
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

	return utils.BSON_WriteFile(
		internals.AudioPlaylistMetadataPath(playlistId),
		&oldData,
	)
}

func (*EditorExport) DeleteAudioFromPlaylist(playlistId int, name string) {
	utils.RemoveFileOrDirectory(
		filepath.Join(internals.AudioPlaylistPath(playlistId), name),
	)
}

func (*EditorExport) UploadAudio(groupId int, filePath string) error {
	fileName := filepath.Base(filePath)
	return utils.CopyFile(filePath, filepath.Join(internals.AudioPath(groupId), fileName))
}

func (*EditorExport) DeleteAudio(groupId int, name string) {}
