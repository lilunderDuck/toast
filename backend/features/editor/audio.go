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
	var out PlaylistMetadata
	if err := utils.BSON_ReadFile(internals.AudioPlaylistMetadataPath(playlistId), &out); err != nil {
		return nil, err
	}

	return &out, nil
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

	oldData.Modified = utils.GetCurrentDateNow()

	return utils.BSON_WriteFile(
		internals.AudioPlaylistMetadataPath(playlistId),
		&oldData,
	)
}

func (*EditorExport) DeletePlaylist(playlistId int) error {
	var data PlaylistMetadata
	if err := utils.BSON_ReadFile(internals.AudioPlaylistPath(playlistId), &data); err != nil {
		return err
	}

	if len(data.Items) != 0 {
		utils.RemoveFileOrDirectory(internals.AudioPlaylistPath(playlistId))
	}

	return nil
}

func (*EditorExport) CreatePlaylistItem(playlistId int, options PlaylistItemOptions) (*PlaylistItemData, error) {
	err := uploadFile(internals.AudioPlaylistPath(playlistId), options.FileName)
	if err != nil {
		return nil, err
	}

	// todo: read title, author, ... from the audio file metadata
	return &PlaylistItemData{
		Name:        "",
		FileName:    filepath.Base(options.FileName),
		Author:      options.Author,
		Description: options.Description,
		Icon:        filepath.Base(options.IconPath),
		Id:          utils.GetRandomIntWithinLength(8),
	}, nil
}

func (*EditorExport) UpdatePlaylistItem(playlistId int, options PlaylistItemOptions) (*PlaylistItemData, error) {
	var oldData PlaylistItemData
	err := utils.BSON_ReadFile(internals.AudioPlaylistPath(playlistId), &oldData)
	if err != nil {
		return nil, err
	}

	if options.Description != "" {
		oldData.Description = options.Description
	}

	if options.Author != "" {
		oldData.Author = options.Author
	}

	if options.FileName != "" {
		oldData.FileName = filepath.Base(options.FileName)
	}

	if options.IconPath != "" {
		oldData.Icon = filepath.Base(options.IconPath)
	}

	err = utils.BSON_WriteFile(internals.AudioPlaylistPath(playlistId), oldData)
	if err != nil {
		return nil, err
	}

	return &oldData, nil
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
