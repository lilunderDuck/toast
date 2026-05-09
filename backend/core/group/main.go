package group

import (
	"path/filepath"
	"toast/backend/db"
	"toast/backend/utils"

	"github.com/fxamacker/cbor/v2"
)

type Service struct {
	Db       *db.Instance
	BasePath string
}

func NewService() *Service {
	db, err := db.Open(GetBasePath() + "/all.db")
	if err != nil {
		panic(err)
	}

	return &Service{
		Db:       db,
		BasePath: GetBasePath(),
	}
}

func (group *Service) Create(options *GroupOptions) (*GroupData, error) {
	groupData := newGroupData(options)

	if err := group.Write(groupData.Id, groupData); err != nil {
		return nil, err
	}

	return groupData, nil
}

func (group *Service) GetAll() []GroupData {
	groups := []GroupData{}

	return groups
}

func (group *Service) Get(groupId string) (*GroupData, error) {
	return group.Read(groupId)
}

func (group *Service) Update(groupId string, newData *GroupOptions) error {
	data, err := group.Read(groupId)
	if err != nil {
		return err
	}

	if newData.Icon != "" {
		if err := group.SaveIcon(data, newData.Icon); err != nil {
			return err
		}
	}

	if newData.Name != "" {
		data.Name = newData.Name
	}

	if newData.Description != "" {
		data.Description = newData.Description
	}

	if len(newData.Explorer.Tree) != 0 {
		data.Explorer = newData.Explorer
	}

	data.Modified = utils.GetCurrentDateNow()
	return group.Write(groupId, data)
}

func (group *Service) Delete(groupId string) error {
	return nil
}

// -------------------------------------------------------------------------------

func (group *Service) SaveIcon(data *GroupData, iconPath string) error {
	err := utils.CopyFile(iconPath, filepath.Join(group.BasePath, data.Id, "icons"))
	if err != nil {
		return err
	}

	data.Icon = filepath.Base(iconPath)
	return nil
}

func (group *Service) Write(groupId string, data *GroupData) error {
	binData, err := cbor.Marshal(data)
	if err != nil {
		return err
	}

	// Why tf do I have to write 2 billions "if err != nil" just for handling error...

	metaFilePath := filepath.Join(group.BasePath, groupId, "meta.dat")
	if err := utils.CreateDirectory(filepath.Dir(metaFilePath)); err != nil {
		return err
	}

	if err := utils.WriteFile(metaFilePath, binData); err != nil {
		return err
	}

	return nil
}

func (group *Service) Read(groupId string) (*GroupData, error) {
	return utils.BSON_ReadFile[GroupData](filepath.Join(group.BasePath, groupId, "meta.dat"))
}
