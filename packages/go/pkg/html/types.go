package html

import "time"

// Article represents an extracted article content
type Article struct {
	Title       string    `json:"title"`
	Author      string    `json:"author"`
	Link        string    `json:"link"`
	Description string    `json:"description"`
	PubDate     time.Time `json:"pubDate"`
	GUID        string    `json:"guid"`
}

// ExtractorOptions represents options for content extraction
type ExtractorOptions struct {
	RemoveTexts     []string `json:"removeTexts"`
	RemoveSelectors []string `json:"removeSelectors"`
	MaxItems        int      `json:"maxItems"`
	Concurrency     int      `json:"concurrency"`
	Language        string   `json:"language"`
}

// DefaultExtractorOptions returns default options
func DefaultExtractorOptions() *ExtractorOptions {
	return &ExtractorOptions{
		MaxItems:    15,
		Concurrency: 5,
		Language:    "zh-cn",
	}
}
