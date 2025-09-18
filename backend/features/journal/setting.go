package journal

import (
	"fmt"
	"toast/backend/utils"
)

func settingDataPath(groupId int) string {
	return fmt.Sprintf("%s/setting.dat", groupFolderPathOf(groupId))
}

func (*GroupExport) GetSetting(groupId int) (*Setting, error) {
	return utils.BSON_ReadFile[Setting](settingDataPath(groupId))
}

func (*GroupExport) SetSetting(groupId int, data *Setting) error {
	return utils.BSON_WriteFile(settingDataPath(groupId), data)
}
