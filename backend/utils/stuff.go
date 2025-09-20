package utils

func GetValueOrDefaultInMap[T comparable, U any](mapping map[T]U, key T, defaultValue U) U {
	value, ok := mapping[key]
	if !ok {
		value = defaultValue
	}

	return value
}

func GetValueOrDefault[T any](something T, defaultValue T) T {
	if IsDefaultValue(something) {
		return defaultValue
	}

	return something
}

func IsDefaultValue(something any) bool {
	switch something.(type) {
	case string:
		return something == ""
	case int:
		return something == 0
	case float64:
		return something == 0.0
	default:
		return something == nil
	}
}
