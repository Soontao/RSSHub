package html

import (
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// Extractor represents an HTML content extractor
type Extractor struct {
	options *ExtractorOptions
}

// NewExtractor creates a new HTML content extractor
func NewExtractor(options *ExtractorOptions) *Extractor {
	if options == nil {
		options = DefaultExtractorOptions()
	}
	return &Extractor{options: options}
}

// ExtractFromHTML extracts article content from HTML string
func (e *Extractor) ExtractFromHTML(html string) (*Article, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, err
	}

	// Remove unwanted texts
	for _, text := range e.options.RemoveTexts {
		doc.Find("p").Each(func(i int, s *goquery.Selection) {
			if strings.Contains(s.Text(), text) {
				s.Remove()
			}
		})
	}

	// Remove unwanted selectors
	for _, selector := range e.options.RemoveSelectors {
		doc.Find(selector).Remove()
	}

	// Extract title
	title := doc.Find("title").First().Text()
	if title == "" {
		title = doc.Find("h1").First().Text()
	}

	// Extract author
	author := doc.Find("meta[name=author]").AttrOr("content", "")
	if author == "" {
		author = doc.Find(".author").First().Text()
	}

	// Extract content
	content := ""
	article := doc.Find("article").First()
	if article.Length() > 0 {
		content, _ = article.Html()
	} else {
		// Fallback to main content area
		content, _ = doc.Find("main").First().Html()
	}

	if content == "" {
		// Further fallback to largest text block
		maxLen := 0
		doc.Find("div,section").Each(func(i int, s *goquery.Selection) {
			text := s.Text()
			if len(text) > maxLen {
				maxLen = len(text)
				content, _ = s.Html()
			}
		})
	}

	// Create article
	result := &Article{
		Title:       strings.TrimSpace(title),
		Author:      strings.TrimSpace(author),
		Description: content,
		PubDate:     time.Now(),
	}

	return result, nil
}

// ExtractLinks extracts all links from HTML matching given selector
func (e *Extractor) ExtractLinks(html string, selector string, prefix string) ([]string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, err
	}

	var links []string
	doc.Find(selector).Each(func(i int, s *goquery.Selection) {
		if href, exists := s.Attr("href"); exists {
			if prefix != "" {
				href = prefix + href
			}
			links = append(links, href)
		}
	})

	return links, nil
}

// ExtractFeedLinks extracts links from RSS/Atom feed content
func (e *Extractor) ExtractFeedLinks(feedContent string) ([]string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(feedContent))
	if err != nil {
		return nil, err
	}

	var links []string
	doc.Find("item link").Each(func(i int, s *goquery.Selection) {
		if link := strings.TrimSpace(s.Text()); link != "" {
			links = append(links, link)
		}
	})

	return links, nil
}
