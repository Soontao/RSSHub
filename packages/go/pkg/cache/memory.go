package cache

import (
	"container/list"
	"sync"
	"time"
)

// MemoryCache implements an in-memory cache with LRU eviction
type MemoryCache struct {
	sync.RWMutex
	items             map[string]*Item
	options           *Options
	cleanupTimer      *time.Timer
	evictionList      *list.List
	evictionMap       map[string]*list.Element
}

// NewMemoryCache creates a new memory cache
func NewMemoryCache(options *Options) *MemoryCache {
	if options == nil {
		options = DefaultOptions()
	}

	cache := &MemoryCache{
		items:        make(map[string]*Item),
		options:      options,
		evictionList: list.New(),
		evictionMap:  make(map[string]*list.Element),
	}

	// Start cleanup routine if cleanup interval > 0
	if options.CleanupInterval > 0 {
		cache.startCleanup()
	}

	return cache
}

// Get retrieves a value from cache
func (c *MemoryCache) Get(key string) (interface{}, bool) {
	c.RLock()
	item, found := c.items[key]
	if !found {
		c.RUnlock()
		return nil, false
	}

	if item.Expired() {
		c.RUnlock()
		c.Delete(key)
		return nil, false
	}

	// Update LRU list
	c.updateEvictionList(key)
	c.RUnlock()

	return item.Value, true
}

// Set stores a value in cache
func (c *MemoryCache) Set(key string, value interface{}, expiration time.Duration) {
	var exp int64
	if expiration > 0 {
		exp = time.Now().Add(expiration).UnixNano()
	}

	c.Lock()
	defer c.Unlock()

	// Check size limit and evict if necessary
	if len(c.items) >= c.options.MaxSize {
		c.evict()
	}

	c.items[key] = &Item{
		Value:      value,
		Expiration: exp,
		Created:    time.Now(),
	}

	// Update eviction list
	c.updateEvictionList(key)
}

// Delete removes a value from cache
func (c *MemoryCache) Delete(key string) {
	c.Lock()
	defer c.Unlock()

	delete(c.items, key)
	if el, exists := c.evictionMap[key]; exists {
		c.evictionList.Remove(el)
		delete(c.evictionMap, key)
	}
}

// Clear removes all values from cache
func (c *MemoryCache) Clear() {
	c.Lock()
	defer c.Unlock()

	c.items = make(map[string]*Item)
	c.evictionList.Init()
	c.evictionMap = make(map[string]*list.Element)
}

// TryGet tries to get a value from cache, if not exists, calls getter and stores result
func (c *MemoryCache) TryGet(key string, getter func() (interface{}, error), expiration time.Duration) (interface{}, error) {
	// Try to get from cache first
	if value, found := c.Get(key); found {
		return value, nil
	}

	// Call getter function
	value, err := getter()
	if err != nil {
		return nil, err
	}

	// Store in cache
	c.Set(key, value, expiration)
	return value, nil
}

// startCleanup starts the cleanup routine
func (c *MemoryCache) startCleanup() {
	ticker := time.NewTicker(c.options.CleanupInterval)
	go func() {
		for range ticker.C {
			c.cleanup()
		}
	}()
}

// cleanup removes expired items
func (c *MemoryCache) cleanup() {
	c.Lock()
	defer c.Unlock()

	for key, item := range c.items {
		if item.Expired() {
			delete(c.items, key)
			if el, exists := c.evictionMap[key]; exists {
				c.evictionList.Remove(el)
				delete(c.evictionMap, key)
			}
		}
	}
}

// updateEvictionList updates the LRU list
func (c *MemoryCache) updateEvictionList(key string) {
	if el, exists := c.evictionMap[key]; exists {
		c.evictionList.MoveToFront(el)
		return
	}
	el := c.evictionList.PushFront(key)
	c.evictionMap[key] = el
}

// evict removes the least recently used item
func (c *MemoryCache) evict() {
	if el := c.evictionList.Back(); el != nil {
		key := el.Value.(string)
		delete(c.items, key)
		c.evictionList.Remove(el)
		delete(c.evictionMap, key)
	}
}
