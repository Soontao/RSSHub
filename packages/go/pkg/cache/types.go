package cache

import "time"

// Cache defines the interface for cache implementations
type Cache interface {
	// Get retrieves a value from cache
	Get(key string) (interface{}, bool)

	// Set stores a value in cache with expiration
	Set(key string, value interface{}, expiration time.Duration)

	// Delete removes a value from cache
	Delete(key string)

	// Clear removes all values from cache
	Clear()

	// TryGet tries to get a value from cache, if not exists, calls getter and stores result
	TryGet(key string, getter func() (interface{}, error), expiration time.Duration) (interface{}, error)
}

// Options represents cache options
type Options struct {
	// DefaultExpiration is the default expiration time for cache entries
	DefaultExpiration time.Duration

	// CleanupInterval is the interval for cleanup of expired items
	CleanupInterval time.Duration

	// MaxSize is the maximum number of items in cache
	MaxSize int
}

// DefaultOptions returns default cache options
func DefaultOptions() *Options {
	return &Options{
		DefaultExpiration: 24 * time.Hour,
		CleanupInterval:  time.Hour,
		MaxSize:          1000,
	}
}

// Item represents a cache item
type Item struct {
	Value      interface{}
	Expiration int64
	Created    time.Time
}

// Expired checks if the item has expired
func (item *Item) Expired() bool {
	if item.Expiration == 0 {
		return false
	}
	return time.Now().UnixNano() > item.Expiration
}
