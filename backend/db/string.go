package db

func (db *LevelDb) GetString(key string) (string, error) {
	data, err := db.internal.Get([]byte(key), nil)
	if err != nil {
		return "", err
	}

	return string(data), nil
}

func (db *LevelDb) SetString(key string, value string) error {
	return db.internal.Put([]byte(key), []byte(value), nil)
}

func (db *LevelDb) DeleteString(key string) error {
	return db.internal.Delete([]byte(key), nil)
}

func (db *LevelDb) GetAllString() []string {
	iter := db.internal.NewIterator(nil, nil)
	content := []string{}
	for iter.Next() {
		value := string(iter.Value())

		content = append(content, value)
	}
	iter.Release()
	return content
}
