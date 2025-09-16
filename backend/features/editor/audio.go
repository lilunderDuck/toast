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
		Created:     utils.GetCurrentDateNow(),
	}

	utils.CreateDirectory(filepath.Dir(internals.AudioPlaylistMetadataPath(playlistId)))
	err := utils.BSON_WriteFile(
		internals.AudioPlaylistMetadataPath(playlistId),
		data,
	)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func (*EditorExport) GetPlaylist(playlistId int) (*PlaylistMetadata, error) {
	return utils.BSON_ReadFile[PlaylistMetadata](internals.AudioPlaylistMetadataPath(playlistId))
}

func (*EditorExport) UpdatePlaylist(playlistId int, options PlaylistOptions) error {
	oldData, err := utils.BSON_ReadFile[PlaylistMetadata](internals.AudioPlaylistMetadataPath(playlistId))
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

	return utils.BSON_WriteFile(
		internals.AudioPlaylistMetadataPath(playlistId),
		&oldData,
	)
}

func (*EditorExport) DeletePlaylist(playlistId int) error {
	data, err := utils.BSON_ReadFile[PlaylistMetadata](internals.AudioPlaylistPath(playlistId))
	if err != nil {
		return err
	}

	if len(data.Items) != 0 {
		utils.RemoveFileOrDirectory(internals.AudioPlaylistPath(playlistId))
	}

	return nil
}

func (*EditorExport) CreatePlaylistItem(
	playlistId int,
	options CreatePlaylistItemOptions,
) (*PlaylistItemData, error) {
	err := uploadFile(internals.AudioPlaylistPath(playlistId), options.AudioFilePath)
	if err != nil {
		return nil, err
	}

	data := PlaylistItemData{
		Name:        options.Name,
		FileName:    filepath.Base(options.AudioFilePath),
		Author:      options.Author,
		Description: options.Description,
		Icon:        filepath.Base(options.IconPath),
		Id:          utils.GetRandomIntWithinLength(8),
	}

	if options.IconPath != "" {
		data.Icon = filepath.Base(options.IconPath)
	}

	// todo: read title, author, ... from the audio file metadata
	return &data, nil
}

func (*EditorExport) DeletePlaylistTrackFile(playlistId int, fileName string) error {
	return utils.RemoveFileOrDirectory(
		filepath.Join(internals.AudioPlaylistPath(playlistId), fileName),
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
