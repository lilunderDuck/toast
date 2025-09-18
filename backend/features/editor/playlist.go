package editor

import (
	"fmt"
	"os"
	"path/filepath"
	"toast/backend/internals"
	"toast/backend/utils"
)

func playlistPath(playlistId int) string {
	return fmt.Sprintf(`%s/playlist/%d`, internals.DATA_FOLDER_PATH, playlistId)
}

func playlistMetaPath(playlistId int) string {
	return fmt.Sprintf(`%s/playlist/%d/meta.dat`, internals.DATA_FOLDER_PATH, playlistId)
}

func readPlaylistData(playlistId int) (*PlaylistMetadata, error) {
	return utils.BSON_ReadFile[PlaylistMetadata](playlistPath(playlistId))
}

func writePlaylistData(playlistId int, data *PlaylistMetadata) error {
	return utils.BSON_WriteFile(playlistPath(playlistId), data)
}

func deletePlaylistData(playlistId int) error {
	return os.Remove(playlistPath(playlistId))
}

func (*EditorExport) CreatePlaylist(options PlaylistOptions) (*PlaylistMetadata, error) {
	playlistId := utils.GetRandomIntWithinLength(16)
	data := &PlaylistMetadata{
		Title:       options.Title,
		Description: options.Description,
		Id:          playlistId,
		Items:       []PlaylistItemData{},
		Created:     utils.GetCurrentDateNow(),
	}

	utils.CreateDirectory(filepath.Dir(playlistPath(playlistId)))

	if err := writePlaylistData(playlistId, data); err != nil {
		return nil, err
	}

	return data, nil
}

func (*EditorExport) GetPlaylist(playlistId int) (*PlaylistMetadata, error) {
	return readPlaylistData(playlistId)
}

func (editor *EditorExport) UpdatePlaylist(playlistId int, options PlaylistOptions) error {
	oldData, err := editor.GetPlaylist(playlistId)
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

	return writePlaylistData(playlistId, oldData)
}

func (group *EditorExport) DeletePlaylist(playlistId int) error {
	return deletePlaylistData(playlistId)
}

func (*EditorExport) CreatePlaylistItem(
	playlistId int,
	options CreatePlaylistItemOptions,
) (*PlaylistItemData, error) {
	err := utils.CopyFile(options.AudioFilePath, playlistMetaPath(playlistId))
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

	fmt.Printf("%#v", data)

	// todo: read title, author, ... from the audio file metadata
	return &data, nil
}

func (*EditorExport) DeletePlaylistTrackFile(playlistId int, fileName string) error {
	return os.Remove(
		filepath.Join(playlistMetaPath(playlistId), fileName),
	)
}

func (*EditorExport) DeleteAudioFromPlaylist(playlistId int, name string) {
	os.Remove(
		filepath.Join(playlistMetaPath(playlistId), name),
	)
}
