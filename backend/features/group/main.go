package group

import (
	"toast/backend/core/group"
)

type Exports struct{}

var service = group.NewService()

func (*Exports) CreateGroup(options *group.GroupOptions) (*group.GroupData, error) {
	return service.Create(options)
}

func (*Exports) GetGroups() []group.GroupData {
	return service.GetAll()
}

func (*Exports) GetGroup(groupId string) (*group.GroupData, error) {
	return service.Get(groupId)
}

func (*Exports) UpdateGroup(groupId string, newData *group.GroupOptions) error {
	return service.Update(groupId, newData)
}

func (*Exports) DeleteGroup(groupId string) error {
	return service.Delete(groupId)
}
