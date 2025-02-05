package misc

type LibraryType uint8

const (
	Dep    LibraryType = 0
	DevDep LibraryType = 1
)

type LibraryData struct {
	Name        string      `json:"name"                    cbor:"0,keyasint"`
	Author      string      `json:"author,omitempty"        cbor:"1,keyasint,omitempty"`
	Version     string      `json:"version"                 cbor:"2,keyasint"`
	Description string      `json:"description"             cbor:"3,keyasint"`
	HomepageUrl string      `json:"homepageUrl,omitempty"   cbor:"4,keyasint,omitempty"`
	Type        LibraryType `json:"type"                    cbor:"5,keyasint"`
}

type LibraryListData []LibraryData

type SplashTextData []string

type SplashTextResponseData struct {
	Text string `json:"text"`
}
