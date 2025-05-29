package http

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// Client represents an HTTP client
type Client struct {
	options *ClientOptions
	client  *http.Client
}

// NewClient creates a new HTTP client
func NewClient(options *ClientOptions) *Client {
	if options == nil {
		options = DefaultClientOptions()
	}

	return &Client{
		options: options,
		client: &http.Client{
			Timeout: time.Duration(options.Timeout) * time.Second,
		},
	}
}

// Get performs a GET request
func (c *Client) Get(urlStr string) (*Response, error) {
	return c.doRequest("GET", urlStr, nil)
}

// GetText performs a GET request and returns the response body as text
func (c *Client) GetText(urlStr string) (string, error) {
	resp, err := c.Get(urlStr)
	if err != nil {
		return "", err
	}
	return resp.Body, nil
}

// Post performs a POST request
func (c *Client) Post(urlStr string, body string) (*Response, error) {
	return c.doRequest("POST", urlStr, strings.NewReader(body))
}

// doRequest performs an HTTP request with retries
func (c *Client) doRequest(method, urlStr string, body io.Reader) (*Response, error) {
	// Parse URL and add default parameters
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return nil, err
	}

	// Add default parameters
	q := parsedURL.Query()
	for k, v := range c.options.DefaultParams {
		if q.Get(k) == "" {
			q.Set(k, v)
		}
	}
	parsedURL.RawQuery = q.Encode()
	urlStr = parsedURL.String()

	var lastErr error
	for retry := 0; retry <= c.options.MaxRetries; retry++ {
		if retry > 0 {
			// Exponential backoff
			time.Sleep(time.Duration(retry*retry) * time.Second)
		}

		req, err := http.NewRequest(method, urlStr, body)
		if err != nil {
			lastErr = err
			continue
		}

		// Set headers
		req.Header.Set("User-Agent", c.options.UserAgent)
		if method == "POST" {
			req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		}

		resp, err := c.client.Do(req)
		if err != nil {
			lastErr = err
			continue
		}
		defer resp.Body.Close()

		// Check status code
		if !c.isAllowedStatus(resp.StatusCode) {
			lastErr = &RequestError{
				URL:        urlStr,
				StatusCode: resp.StatusCode,
				Message:    fmt.Sprintf("unexpected status code: %d", resp.StatusCode),
			}

			if !c.shouldRetry(resp.StatusCode) {
				return nil, lastErr
			}
			continue
		}

		// Read response body
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			lastErr = err
			continue
		}

		// Create response
		headers := make(map[string]string)
		for k, v := range resp.Header {
			headers[k] = strings.Join(v, ", ")
		}

		return &Response{
			StatusCode: resp.StatusCode,
			Headers:    headers,
			Body:       string(bodyBytes),
		}, nil
	}

	return nil, fmt.Errorf("max retries exceeded: %v", lastErr)
}

// isAllowedStatus checks if a status code is allowed
func (c *Client) isAllowedStatus(code int) bool {
	for _, allowed := range c.options.AllowedCodes {
		if code == allowed {
			return true
		}
	}
	return false
}

// shouldRetry checks if a request should be retried based on status code
func (c *Client) shouldRetry(code int) bool {
	for _, retryCode := range c.options.RetryOnCodes {
		if code == retryCode {
			return true
		}
	}
	return false
}

var FeedHttpClient = NewClient(DefaultClientOptions())
