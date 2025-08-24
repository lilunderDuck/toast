package journal

import (
	"path/filepath"
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

func settingFileSavedPath(groupId int) string {
	return filepath.Join(GetSavedPath(groupId), "setting.dat")
}

func createSettingFile(groupId int) {
	utils.BSON_WriteFile(settingFileSavedPath(groupId), Setting{})
}

func (*GroupExport) GetSetting(groupId int) (*Setting, error) {
	var out Setting
	err := utils.BSON_ReadFile(settingFileSavedPath(groupId), &out)
	return &out, err
}

func (*GroupExport) SetSetting(groupId int, data *Setting) error {
	return utils.BSON_ReadFile(settingFileSavedPath(groupId), data)
}
