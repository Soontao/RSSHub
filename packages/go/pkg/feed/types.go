package feed

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/feeds"
)

// FeedItem represents a single item in the feed
type FeedItem struct {
	Title       string    `json:"title"`
	Link        string    `json:"link"`
	Description string    `json:"description"`
	Author      string    `json:"author"`
	GUID        string    `json:"guid"`
	PubDate     time.Time `json:"pubDate"`
}

// Feed represents an RSS/Atom feed
type Feed struct {
	Title       string     `json:"title"`
	Link        string     `json:"link"`
	Description string     `json:"description"`
	Language    string     `json:"language"`
	Items       []FeedItem `json:"items"`
}

func (f *Feed) Handle(ctx *gin.Context) {

}

// BuilderOptions represents options for feed generation
type BuilderOptions struct {
	EntryURL           string   `json:"entryUrl"`
	FeedTitle          string   `json:"feedTitle"`
	Concurrency        int      `json:"concurrency"`
	MaxItems           int      `json:"maxItems"`
	RemoveTexts        []string `json:"removeTexts"`
	RemoveSelectors    []string `json:"removeSelectors"`
	Language           string   `json:"language"`
	SkipPure           bool     `json:"skipPure"`
	TranslateTitle     bool     `json:"translateTitle"`
	MinPublishInterval float64  `json:"minPublishInterval"`
}

// DefaultBuilderOptions returns default options for feed builder
func DefaultBuilderOptions() *BuilderOptions {
	return &BuilderOptions{
		Concurrency:        5,
		MaxItems:           15,
		Language:           "zh-cn",
		MinPublishInterval: 0.5,
	}
}

// ToGorilla converts our Feed to gorilla/feeds.Feed
func (f *Feed) ToGorilla() *feeds.Feed {
	feed := &feeds.Feed{
		Title:       f.Title,
		Link:        &feeds.Link{Href: f.Link},
		Description: f.Description,
		Created:     time.Now(),
	}

	feed.Items = make([]*feeds.Item, len(f.Items))
	for i, item := range f.Items {
		feed.Items[i] = &feeds.Item{
			Title:       item.Title,
			Link:        &feeds.Link{Href: item.Link},
			Description: item.Description,
			Author:      &feeds.Author{Name: item.Author},
			Created:     item.PubDate,
			Id:          item.GUID,
		}
	}

	return feed
}

// LinkExtractor is a function type that extracts links from HTML content
type LinkExtractor func(html string) ([]string, error)

// ContentExtractor is a function type that extracts content from HTML
type ContentExtractor func(html string) (*FeedItem, error)
