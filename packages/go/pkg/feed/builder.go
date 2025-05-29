package feed

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"sync"
	"time"

	"theosun/RSSHub/packages/go/pkg/html"
	"theosun/RSSHub/packages/go/pkg/http"

	"github.com/gin-gonic/gin"
)

// Builder represents a feed builder
type Builder struct {
	options          *BuilderOptions
	linkExtractor    LinkExtractor
	contentExtractor ContentExtractor
	htmlExtractor    *html.Extractor
}

// NewBuilder creates a new feed builder
func NewBuilder() *Builder {
	return &Builder{
		options:       DefaultBuilderOptions(),
		htmlExtractor: html.NewExtractor(nil),
	}
}

// WithOptions sets the builder options
func (b *Builder) WithOptions(options *BuilderOptions) *Builder {
	b.options = options
	return b
}

// WithEntryURL sets the entry URL
func (b *Builder) WithEntryURL(url string) *Builder {
	b.options.EntryURL = url
	return b
}

// WithFeedTitle sets the feed title
func (b *Builder) WithFeedTitle(title string) *Builder {
	b.options.FeedTitle = title
	return b
}

// WithConcurrency sets the concurrency level
func (b *Builder) WithConcurrency(n int) *Builder {
	b.options.Concurrency = n
	return b
}

// WithMaxItems sets the maximum number of items
func (b *Builder) WithMaxItems(n int) *Builder {
	b.options.MaxItems = n
	return b
}

// WithRemoveTexts sets texts to be removed
func (b *Builder) WithRemoveTexts(texts []string) *Builder {
	b.options.RemoveTexts = texts
	return b
}

// WithRemoveSelectors sets selectors to be removed
func (b *Builder) WithRemoveSelectors(selectors []string) *Builder {
	b.options.RemoveSelectors = selectors
	return b
}

// WithLanguage sets the feed language
func (b *Builder) WithLanguage(lang string) *Builder {
	b.options.Language = lang
	return b
}

// WithLinkExtractor sets the link extractor
func (b *Builder) WithLinkExtractor(extractor LinkExtractor) *Builder {
	b.linkExtractor = extractor
	return b
}

// WithContentExtractor sets the content extractor
func (b *Builder) WithContentExtractor(extractor ContentExtractor) *Builder {
	b.contentExtractor = extractor
	return b
}

// WithDomLinkExtractor sets a DOM-based link extractor
func (b *Builder) WithDomLinkExtractor(selector string, prefix string) *Builder {
	b.linkExtractor = func(content string) ([]string, error) {
		return b.htmlExtractor.ExtractLinks(content, selector, prefix)
	}
	return b
}

func (b *Builder) Build() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if b.linkExtractor == nil || b.contentExtractor == nil {
			ctx.JSON(400, gin.H{"error": "Link and content extractors must be set"})
			return
		}

		// Extract links
		listPage, err := http.FeedHttpClient.GetText(b.options.EntryURL)
		if err != nil {
			ctx.JSON(500, gin.H{"error": fmt.Sprintf("Failed to fetch entry URL: %v", err)})
			return
		}
		links, err := b.linkExtractor(listPage)
		if err != nil {
			ctx.JSON(500, gin.H{"error": fmt.Sprintf("Failed to extract links: %v", err)})
			return
		}

		// Limit number of links
		if len(links) > b.options.MaxItems {
			links = links[:b.options.MaxItems]
		}

		// Create feed
		feed := &Feed{
			Title:    b.options.FeedTitle,
			Link:     b.options.EntryURL,
			Language: b.options.Language,
		}

		// Process links concurrently
		var wg sync.WaitGroup
		itemChan := make(chan *FeedItem, len(links))
		semaphore := make(chan struct{}, b.options.Concurrency)

		for _, link := range links {
			wg.Add(1)
			go func(link string) {
				defer wg.Done()
				semaphore <- struct{}{}        // Acquire
				defer func() { <-semaphore }() // Release
				contentPage, err := http.FeedHttpClient.GetText(link)
				if err != nil {
					return
				}
				item, err := b.contentExtractor(contentPage)
				if err != nil {
					return
				}

				item.Link = link

				// Generate GUID
				h := md5.New()
				h.Write(fmt.Appendf(nil, "%s|%d|%s",
					feed.Title,
					time.Now().UnixMilli(),
					item.Title))
				item.GUID = hex.EncodeToString(h.Sum(nil))

				itemChan <- item
			}(link)
		}

		// Wait for all goroutines to complete
		go func() {
			wg.Wait()
			close(itemChan)
		}()

		// Collect items
		for item := range itemChan {
			feed.Items = append(feed.Items, *item)
		}

		s, err := feed.ToGorilla().ToRss()
		if err != nil {
			ctx.JSON(500, gin.H{"error": fmt.Sprintf("Failed to convert feed: %v", err)})
			return
		}
		ctx.Header("Content-Type", "application/xml, charset=utf-8")
		ctx.String(200, s)
	}
}
