package utils

import (
	"math/rand"
	"strconv"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

func GetRandomStringWithinLength(length int) string {
	return gonanoid.MustGenerate("0123456789qwertyuiopasdfghjklzxcvbnm", length)
}

func GetRandomIntWithinLength(length int) int {
	result, err := strconv.Atoi(gonanoid.MustGenerate("123456789", length))
	if err != nil {
		panic(err) // make sure to yell whenever weird shit happens
	}
	return result
}

// Generates a random 8-character string containing only digits (1-9).
//
// Returns the generated string. Throws an error if (for some reason) there's a problem generating it.
func GetRandomInt() int {
	return GetRandomIntWithinLength(8)
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
