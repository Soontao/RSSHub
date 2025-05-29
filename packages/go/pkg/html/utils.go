package html

import (
	"strings"

	md2html "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/microcosm-cc/bluemonday"
	"github.com/russross/blackfriday/v2"
)

// ToTitleCase converts a string to title case
func ToTitleCase(s string) string {
	words := strings.Fields(strings.ToLower(s))
	for i, word := range words {
		if len(word) > 0 {
			r := []rune(word)
			r[0] = []rune(strings.ToUpper(string(r[0])))[0]
			words[i] = string(r)
		}
	}
	return strings.Join(words, " ")
}

var converter = md2html.NewConverter("", true, nil)

// HTMLToMarkdown converts HTML to Markdown
func HTMLToMarkdown(html string) (string, error) {
	markdown, err := converter.ConvertString(html)
	if err != nil {
		return "", err
	}
	return markdown, nil
}

// MarkdownToHTML converts Markdown to HTML
func MarkdownToHTML(markdown string) string {
	unsafe := blackfriday.Run([]byte(markdown))
	html := bluemonday.UGCPolicy().SanitizeBytes(unsafe)
	return string(html)
}

// CleanHTML removes unwanted HTML elements and attributes
func CleanHTML(html string) string {
	p := bluemonday.UGCPolicy()
	// Allow common HTML elements
	p.AllowStandardURLs()
	p.AllowStandardAttributes()
	p.AllowElements("p", "br", "h1", "h2", "h3", "h4", "h5", "h6",
		"strong", "em", "i", "b", "u", "a", "img", "blockquote",
		"code", "pre", "ul", "ol", "li", "table", "thead", "tbody",
		"tr", "th", "td")

	return p.Sanitize(html)
}

// ExtractText extracts plain text from HTML
func ExtractText(html string) string {
	p := bluemonday.StripTagsPolicy()
	return p.Sanitize(html)
}

// NormalizeURL ensures URL is properly formatted
func NormalizeURL(url string) string {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		return "https://" + url
	}
	return url
}

// IsValidURL checks if a URL is valid
func IsValidURL(url string) bool {
	return strings.HasPrefix(url, "http://") || strings.HasPrefix(url, "https://")
}
