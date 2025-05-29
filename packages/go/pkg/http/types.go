package http

// ClientOptions represents HTTP client options
type ClientOptions struct {
	Timeout       int               `json:"timeout"`       // Timeout in seconds
	MaxRetries    int               `json:"maxRetries"`    // Maximum number of retries
	UserAgent     string            `json:"userAgent"`     // User agent string
	AllowedCodes  []int             `json:"allowedCodes"`  // Allowed HTTP status codes
	RetryOnCodes  []int             `json:"retryOnCodes"`  // Status codes that trigger retry
	DefaultParams map[string]string `json:"defaultParams"` // Default query parameters
}

// DefaultClientOptions returns default client options
func DefaultClientOptions() *ClientOptions {
	return &ClientOptions{
		Timeout:       30,
		MaxRetries:    3,
		UserAgent:     "RSSHub/2.0 (+https://theosun/RSSHub)",
		AllowedCodes:  []int{200},
		RetryOnCodes:  []int{408, 429, 500, 502, 503, 504},
		DefaultParams: make(map[string]string),
	}
}

// Response represents an HTTP response
type Response struct {
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers"`
	Body       string            `json:"body"`
}

// RequestError represents an HTTP request error
type RequestError struct {
	URL        string `json:"url"`
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

func (e *RequestError) Error() string {
	return e.Message
}
