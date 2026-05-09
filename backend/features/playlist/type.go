package playlist

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
	Id            int    `json:"id"`
	CoverIcon     string `json:"coverIcon,omitempty"`
}

type UpdatedPlaylist struct {
	Metadata PlaylistData        `json:"metadata"`
	Tracks   []PlaylistTrackData `json:"tracks"`
}
