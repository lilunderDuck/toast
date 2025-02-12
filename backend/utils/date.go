package utils

import "time"

func GetCurrentDateNow() time.Duration {
	return time.Duration(time.Now().Unix())
}
