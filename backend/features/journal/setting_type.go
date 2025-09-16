package journal

import (
	"toast/backend/internals"
	"toast/backend/utils"
)

type Setting struct {
	Tags []TagData `json:"tags,omitempty"         cbor:"0,keyasint"`
}

type TagData struct {
	Name        string `json:"name"                    cbor:"0,keyasint"`
	Color       string `json:"color"                   cbor:"1,keyasint"`
	Description string `json:"description,omitempty"   cbor:"2,keyasint"`
}

func createSettingFile(groupId int) {
	utils.BSON_WriteFile(internals.SettingFileSavedPath(groupId), Setting{})
}

func (*GroupExport) GetSetting(groupId int) (*Setting, error) {
	return utils.BSON_ReadFile[Setting](internals.SettingFileSavedPath(groupId))
}

func (*GroupExport) SetSetting(groupId int, data *Setting) error {
	return utils.BSON_WriteFile(internals.SettingFileSavedPath(groupId), data)
}
