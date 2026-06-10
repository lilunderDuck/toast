package playlist

type PlaylistCreateTrackOption struct {
	Name      string `json:"name"`
	Artist    string `json:"artist"`
	IconPath  string `json:"iconPath,omitempty"`
	TrackPath string `json:"trackPath"`
}

type PlaylistTrackData struct {
	Name     string `json:"name"`
	Artist   string `json:"artist"`
	Icon     string `json:"icon,omitempty"`
	Duration uint   `json:"duration"`
	Id       int    `json:"id"`
	Filename string `json:"filename"`
}

type PlaylistData struct {
	Name          string `json:"name"`
	Icon          string `json:"icon,omitempty"`
	TotalDuration uint   `json:"totalDuration"`
	Id            string `json:"id"`
	CoverIcon     string `json:"coverIcon,omitempty"`
}

type UpdatedPlaylist struct {
	Metadata PlaylistData        `json:"metadata"`
	Tracks   []PlaylistTrackData `json:"tracks"`
}
