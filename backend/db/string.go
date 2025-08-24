package db

// import "github.com/lotusdblabs/lotusdb/v2"

func (db *DbInstance) GetString(key string) (string, error) {
	data, err := db.internal.Get([]byte(key))
	if err != nil {
		return "", err
	}

	return string(data), nil
}

func (db *DbInstance) SetString(key string, value string) error {
	return db.internal.Put([]byte(key), []byte(value))
}

func (db *DbInstance) DeleteString(key string) error {
	return db.internal.Delete([]byte(key))
}

// func (db *DbInstance) GetAllString() []string {
// 	iter, err := db.internal.NewIterator(lotusdb.IteratorOptions{})
// 	if err != nil {
// 		panic(err)
// 	}

// 	content := []string{}
// 	for iter.Next() {
// 		value := string(iter.Value())

// 		content = append(content, value)
// 	}
// 	iter.Release()
// 	return content
// }
