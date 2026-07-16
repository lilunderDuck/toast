package common

type ValidationResult struct {
	ErrorType int    `json:"errorType"`
	Message   string `json:"message"`
}

func NewValidationResult(errType int, message string) *ValidationResult {
	return &ValidationResult{
		ErrorType: errType,
		Message:   message,
	}
}
