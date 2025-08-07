package utils

import (
	"math/rand"
	"strconv"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

// Generates a random 8-character string containing only digits (1-9).
//
// Returns the generated string and an error if (for some reason) there's a problem generating it.
func GetRandomInt() int {
	result, _ := strconv.Atoi(gonanoid.MustGenerate("123456789", 8))
	return result
}

// Selects a random element from the given array.
// It takes an array of any type and returns a single element of that type.
//
// Parameters:
//   - someArray: any array type you want to put into here.
//
// Returns the choosen element from someArray
func GetRandomElementFromArray[T any](someArray []T) (choosenElement T) {
	randomIndex := rand.Intn(len(someArray))
	return someArray[randomIndex]
}
