package config

// Config represents the application configuration
type Config struct {
	// Server configurations
	Server struct {
		Port           int      `json:"port" yaml:"port"`
		Host           string   `json:"host" yaml:"host"`
		BaseURL        string   `json:"baseUrl" yaml:"baseUrl"`
		TrustedProxies []string `json:"trustedProxies" yaml:"trustedProxies"`
	} `json:"server" yaml:"server"`

	// Cache configurations
	Cache struct {
		Type            string `json:"type" yaml:"type"`
		ExpireTime      int    `json:"expireTime" yaml:"expireTime"`
		MaxSize         int    `json:"maxSize" yaml:"maxSize"`
		CleanupInterval int    `json:"cleanupInterval" yaml:"cleanupInterval"`
	} `json:"cache" yaml:"cache"`

	// Feed configurations
	Feed struct {
		MaxItems           int     `json:"maxItems" yaml:"maxItems"`
		DefaultConcurrency int     `json:"defaultConcurrency" yaml:"defaultConcurrency"`
		MaxOldItemDays     int     `json:"maxOldItemDays" yaml:"maxOldItemDays"`
		MinPublishInterval float64 `json:"minPublishInterval" yaml:"minPublishInterval"`
	} `json:"feed" yaml:"feed"`

	// HTTP client configurations
	HTTP struct {
		Timeout      int    `json:"timeout" yaml:"timeout"`
		MaxRetries   int    `json:"maxRetries" yaml:"maxRetries"`
		UserAgent    string `json:"userAgent" yaml:"userAgent"`
		AllowedCodes []int  `json:"allowedCodes" yaml:"allowedCodes"`
		RetryOnCodes []int  `json:"retryOnCodes" yaml:"retryOnCodes"`
	} `json:"http" yaml:"http"`
}

// DefaultConfig returns the default configuration
func DefaultConfig() *Config {
	config := &Config{}

	// Server defaults
	config.Server.Port = 1200
	config.Server.Host = "localhost"
	config.Server.BaseURL = "http://localhost:1200"
	config.Server.TrustedProxies = []string{"127.0.0.1"}

	// Cache defaults
	config.Cache.Type = "memory"
	config.Cache.ExpireTime = 86400 // 24 hours
	config.Cache.MaxSize = 1000
	config.Cache.CleanupInterval = 3600 // 1 hour

	// Feed defaults
	config.Feed.MaxItems = 15
	config.Feed.DefaultConcurrency = 5
	config.Feed.MaxOldItemDays = 30
	config.Feed.MinPublishInterval = 0.5

	// HTTP defaults
	config.HTTP.Timeout = 30
	config.HTTP.MaxRetries = 3
	config.HTTP.UserAgent = "RSSHub/2.0 (+https://theosun/RSSHub)"
	config.HTTP.AllowedCodes = []int{200}
	config.HTTP.RetryOnCodes = []int{408, 429, 500, 502, 503, 504}

	return config
}
