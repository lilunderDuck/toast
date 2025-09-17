package utils

import "time"

// Gets the current UNIX timestamp in seconds.
//
// To convert to javascript's Date, you may need to use
//   new Date(currentTime * 1000)
func GetCurrentDateNow() (currentDateIs time.Duration) {
	return time.Duration(time.Now().Unix())
}
