package utils

import "time"

// Gets the current time and turns it into a special number.
// This number tells you how many seconds have passed since a very long time ago (January 1, 1970).
//
// Returns:
//   - A number that represents the current time.
func GetCurrentDateNow() (currentDateIs time.Duration) {
	return time.Duration(time.Now().Unix())
}
