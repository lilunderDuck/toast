package misc

// Represents the type of a library used in the application.
// It distinguishes between libraries needed for the app to run (dependencies)
// and libraries used during development.
type LibraryType uint8

const (
	// Libraries needed for the app to run.
	Dep LibraryType = 0
	// Libraries used during development.
	DevDep LibraryType = 1
)

// Holds information about a specific library used by the application.
type LibraryData struct {
	Name        string      `json:"name"                    cbor:"0,keyasint"`
	Author      string      `json:"author,omitempty"        cbor:"1,keyasint,omitempty"`
	Version     string      `json:"version"                 cbor:"2,keyasint"`
	Description string      `json:"description"             cbor:"3,keyasint"`
	HomepageUrl string      `json:"homepageUrl,omitempty"   cbor:"4,keyasint,omitempty"`
	Type        LibraryType `json:"type"                    cbor:"5,keyasint"`
}

// Representing a list of libraries used by the application.
type LibraryListData []LibraryData

// Representing a list of splash text messages.
type SplashTextData []string

// Holds the data for a splash text response.
//
// It contains a single string representing the splash text message which will
// show when the app is starting up.
type SplashTextResponseData struct {
	Text string `json:"text"`
}
