package playlist

func (*Exports) GetAllPlaylistsData() []PlaylistData {
	return []PlaylistData{
		{
			Name:          "Russia's Most Beautiful Tunes: The Stars of St. Petersburg",
			Icon:          "cover.jpg",
			TotalDuration: 13045,
		},
	}
}

func (*Exports) GetPlaylistData(playlistId int) PlaylistData {
	return PlaylistData{
		Name:          "Russia's Most Beautiful Tunes: The Stars of St. Petersburg",
		Icon:          "cover.jpg",
		TotalDuration: 13045,
	}
}
