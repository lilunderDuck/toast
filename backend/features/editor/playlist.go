package editor

import (
	"fmt"
	"path/filepath"
	"strings"
	"toast/backend/features/audio"
	"toast/backend/utils"
)

func (*EditorExport) CreatePlaylist(options PlaylistOptions) (*PlaylistMetadata, error) {
	playlistId := utils.GetRandomInt()
	data := &PlaylistMetadata{
		Title:       options.Title,
		Description: options.Description,
		Id:          playlistId,
		Items:       []PlaylistItemData{},
		Created:     utils.GetCurrentDateNow(),
	}

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
	audioDuration, err := audio.GetDuration(options.AudioFilePath)
	if err != nil {
		return nil, err
	}

	if err = utils.CopyFile(options.AudioFilePath, playlistPath(playlistId)); err != nil {
		return nil, err
	}

	audioFileName := filepath.Base(options.AudioFilePath)

	iconFileName := filepath.Base(options.IconPath)
	if iconFileName == "." {
		iconFileName = ""
	}

	if !utils.IsDefaultValue(options.IconPath) {
		options.IconPath = utils.RenameFileInPath(options.IconPath, func(_ string) string {
			return strings.Replace(audioFileName, filepath.Ext(audioFileName), "", 2)
		})
	}

	data := PlaylistItemData{
		Name:        options.Name,
		Author:      options.Author,
		Description: options.Description,
		FileName:    audioFileName,
		Icon:        iconFileName,
		Id:          utils.GetRandomInt(),
		Duration:    int(audioDuration),
	}

	fmt.Printf("%#v", data)

	return &data, nil
}

func (*EditorExport) GetAudioDataFrom(audioFilePath string) (*audio.Info, error) {
	return audio.GetInfo(audioFilePath)
}
