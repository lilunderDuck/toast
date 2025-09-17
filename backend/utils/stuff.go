package utils

func GetValueOrDefault[T comparable, U any](mapping map[T]U, key T, defaultValue U) U {
	value, ok := mapping[key]
	if !ok {
		value = defaultValue
	}

	return value
}
