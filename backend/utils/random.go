package utils

import (
	"math/rand"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

func GetRandomIntString() (string, error) {
	return gonanoid.Generate("123456789", 8)
}

func GetRandomElementFromArray[T any](array []T) T {
	randomIndex := rand.Intn(len(array))
	return array[randomIndex]
}

func GenerateRandomNumberId() (string, int) {
	randomId, randomError := GetRandomIntString()
	if randomError != nil {
		panic(randomError)
	}

	idNumber := StringToInt(randomId)

	return randomId, idNumber
}
