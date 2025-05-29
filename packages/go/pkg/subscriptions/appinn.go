package subscriptions

import (
	"strings"
	"theosun/RSSHub/packages/go/pkg/feed"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
)

func AppinnSubscription() gin.HandlerFunc {
	b := feed.NewBuilder()
	b.WithEntryURL("https://www.appinn.com/")
	b.WithFeedTitle("Appinn")
	b.WithConcurrency(5)
	b.WithMaxItems(15)
	b.WithRemoveTexts([]string{"广告", "推广"})
	b.WithRemoveSelectors([]string{"#sidebar", ".post-meta", ".post-tags"})
	b.WithLanguage("zh-cn")
	b.WithDomLinkExtractor(".post-data a", "")
	b.WithContentExtractor(func(html string) (*feed.FeedItem, error) {
		doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
		if err != nil {
			return nil, err
		}
		content := doc.Find(".post-single-content")
		content.Find(".simplefavorite-button").Remove()
		content.Find(".wpulike").Remove()

		title := doc.Find(".title").Text()
		pubDateStr := doc.Find("head > meta[property='article:published_time']").AttrOr("content", "")
		pubDate, err := time.Parse(time.RFC3339, pubDateStr)
		if err != nil {
			return nil, err
		}
		author := doc.Find(".theauthor a").Text()
		description, err := content.Html()
		if err != nil {
			return nil, err
		}

		return &feed.FeedItem{
			Title:       title,
			Description: description,
			Author:      author,
			PubDate:     pubDate,
		}, nil

	})

	return b.Build()
}
