package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"gopkg.in/yaml.v3"
)

// Manager handles configuration management
type Manager struct {
	config *Config
}

// NewManager creates a new configuration manager
func NewManager() *Manager {
	return &Manager{
		config: DefaultConfig(),
	}
}

// LoadFile loads configuration from a file
func (m *Manager) LoadFile(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("failed to read config file: %v", err)
	}

	config := DefaultConfig()
	if err := yaml.Unmarshal(data, config); err != nil {
		return fmt.Errorf("failed to parse config file: %v", err)
	}

	m.config = config
	return nil
}

// LoadEnv loads configuration from environment variables
func (m *Manager) LoadEnv() {
	// Server configurations
	if port := os.Getenv("RSSHUB_PORT"); port != "" {
		if p, err := strconv.Atoi(port); err == nil {
			m.config.Server.Port = p
		}
	}
	if host := os.Getenv("RSSHUB_HOST"); host != "" {
		m.config.Server.Host = host
	}
	if baseURL := os.Getenv("RSSHUB_BASE_URL"); baseURL != "" {
		m.config.Server.BaseURL = baseURL
	}
	if proxies := os.Getenv("RSSHUB_TRUSTED_PROXIES"); proxies != "" {
		m.config.Server.TrustedProxies = strings.Split(proxies, ",")
	}

	// Cache configurations
	if cacheType := os.Getenv("RSSHUB_CACHE_TYPE"); cacheType != "" {
		m.config.Cache.Type = cacheType
	}
	if expireTime := os.Getenv("RSSHUB_CACHE_EXPIRE"); expireTime != "" {
		if t, err := strconv.Atoi(expireTime); err == nil {
			m.config.Cache.ExpireTime = t
		}
	}
	if maxSize := os.Getenv("RSSHUB_CACHE_MAX_SIZE"); maxSize != "" {
		if size, err := strconv.Atoi(maxSize); err == nil {
			m.config.Cache.MaxSize = size
		}
	}

	// Feed configurations
	if maxItems := os.Getenv("RSSHUB_MAX_ITEMS"); maxItems != "" {
		if items, err := strconv.Atoi(maxItems); err == nil {
			m.config.Feed.MaxItems = items
		}
	}
	if concurrency := os.Getenv("RSSHUB_CONCURRENCY"); concurrency != "" {
		if c, err := strconv.Atoi(concurrency); err == nil {
			m.config.Feed.DefaultConcurrency = c
		}
	}

	// HTTP configurations
	if timeout := os.Getenv("RSSHUB_HTTP_TIMEOUT"); timeout != "" {
		if t, err := strconv.Atoi(timeout); err == nil {
			m.config.HTTP.Timeout = t
		}
	}
	if retries := os.Getenv("RSSHUB_HTTP_RETRIES"); retries != "" {
		if r, err := strconv.Atoi(retries); err == nil {
			m.config.HTTP.MaxRetries = r
		}
	}
	if userAgent := os.Getenv("RSSHUB_USER_AGENT"); userAgent != "" {
		m.config.HTTP.UserAgent = userAgent
	}
}

// Get returns the current configuration
func (m *Manager) Get() *Config {
	return m.config
}

// Save saves the current configuration to a file
func (m *Manager) Save(path string) error {
	// Create directory if not exists
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create config directory: %v", err)
	}

	// Marshal config to YAML
	data, err := yaml.Marshal(m.config)
	if err != nil {
		return fmt.Errorf("failed to marshal config: %v", err)
	}

	// Write to file
	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("failed to write config file: %v", err)
	}

	return nil
}

// SetValue sets a configuration value by key path
func (m *Manager) SetValue(path string, value interface{}) error {
	// TODO: Implement dynamic configuration setting
	return fmt.Errorf("not implemented")
}

// GetValue gets a configuration value by key path
func (m *Manager) GetValue(path string) (interface{}, error) {
	// TODO: Implement dynamic configuration getting
	return nil, fmt.Errorf("not implemented")
}
