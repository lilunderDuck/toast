package utils

import (
	"math/rand"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

// Generates a random 8-character string containing only digits (1-9).
//
// Returns the generated string and an error if (for some reason) there's a problem generating it.
func GetRandomIntString() (string, error) {
	return gonanoid.Generate("123456789", 8)
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

// Creates a random numeric ID as a string and its integer equivalent.
//
// If an error occurs during string generation, it panics (stops the program),
// in extremely rare cases. Let's just say that this function works in 100% "all of the cases"
//
// Returns both of the the string ID and the integer ID.
func GenerateRandomNumberId() (string, int) {
	randomId, randomError := GetRandomIntString()
	if randomError != nil {
		panic(randomError)
	}

	idNumber := StringToInt(randomId)

	return randomId, idNumber
}
