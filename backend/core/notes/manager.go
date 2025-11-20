package notes

var Services map[string]*Service

func GetService(groupId string) (*Service, error) {
	service, ok := Services[groupId]
	if !ok {
		newService, err := NewService(groupId)
		if err != nil {
			return nil, err
		}

		service = newService
	}

	return service, nil
}
