package utils

// import "fmt"

func GetValueOrDefault[T comparable, U any](mapping map[T]U, key T, defaultValue U) U {
	value, ok := mapping[key]
	if !ok {
		// fmt.Printf("Key \"%s\" does not exist in the mapping", key)
		value = defaultValue
	}

	return value
}
