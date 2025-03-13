package dynamic

import "net/http"

func sendStatusCode(w http.ResponseWriter, status int, additionalMessage string) {
	w.WriteHeader(status)
	w.Write([]byte(additionalMessage))
}

func addHeader(w http.ResponseWriter, name string, value string) {
	w.Header().Add(name, value)
}
