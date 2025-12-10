package notes

var Services map[string]*Service

func GetService(groupId string) *Service {
	service, ok := Services[groupId]
	if !ok {
		newService := NewService(groupId)
		service = newService
	}

	return service
}
