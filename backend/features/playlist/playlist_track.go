package playlist

func (*Exports) AddPlaylistTrackData(id int, data PlaylistTrackData) error {
	driver := playlistDbs[id]
	return driver.Insert(data)
}

func (*Exports) UpdatePlaylistTrackData(id int, data *PlaylistTrackData) error {
	driver := playlistDbs[id]

	var playlistData PlaylistTrackData
	err := driver.Open(PlaylistTrackData{}).
		Where("id", "=", data.Id).
		First().
		AsEntity(&playlistData)
	//
	if err != nil {
		return err
	}

	if data.Artist != "" {
		playlistData.Artist = data.Artist
	}

	if data.Duration != 0 {
		playlistData.Duration = data.Duration
	}

	if data.Icon != "" {
		playlistData.Icon = data.Icon
	}

	if data.Name != "" {
		playlistData.Name = data.Name
	}

	return driver.Update(playlistData)
}
