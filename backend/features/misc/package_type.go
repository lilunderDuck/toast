package misc

type PackageContentData struct {
	Id          uint              `json:"id,omitempty"`
	Name        string            `json:"name"`
	Description string            `json:"description,omitempty"`
	Maintainers int               `json:"maintainers,omitempty"`
	Author      PackageAuthorData `json:"author,omitempty"`
	License     string            `json:"license,omitempty"`
	Homepage    string            `json:"homepage,omitempty"`
	Version     []int             `json:"version,omitempty"`
}

type PackageAuthorData struct {
	Url  string `json:"url,omitempty"`
	Name string `json:"name,omitempty"`
}

type PackageMetadata struct {
	Name     string `json:"name,omitempty"`
	Id       uint   `json:"id,omitempty"`
	Homepage string `json:"homepage,omitempty"`
}
