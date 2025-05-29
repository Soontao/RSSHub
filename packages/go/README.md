# RSSHub Go Implementation

This is a Go implementation of RSSHub, providing high-performance RSS feed generation capabilities.

## Features

- High-performance HTTP client with retry mechanism
- Memory cache with LRU eviction
- Configurable through environment variables or YAML file
- Concurrent feed item fetching
- HTML content extraction
- RSS/Atom feed generation
- Easy-to-use feed builder pattern

## Requirements

- Go 1.20 or higher

## Installation

```bash
git clone https://theosun/RSSHub.git
cd RSSHub/packages/go
go mod download
```

## Configuration

Configuration can be done through environment variables or a YAML file. Environment variables take precedence over file configuration.

### Environment Variables

- `RSSHUB_PORT`: Server port (default: 1200)
- `RSSHUB_HOST`: Server host (default: 0.0.0.0)
- `RSSHUB_BASE_URL`: Base URL for generated feeds
- `RSSHUB_CACHE_TYPE`: Cache type (default: memory)
- `RSSHUB_CACHE_EXPIRE`: Cache expiration time in seconds
- `RSSHUB_MAX_ITEMS`: Maximum items per feed
- `RSSHUB_CONCURRENCY`: Default concurrency for feed generation

## Usage

### Starting the Server

```bash
go run main.go
```

### Creating a New Feed

```go
// Create a new feed builder
builder := feed.NewBuilder().
    WithFeedTitle("My Feed").
    WithEntryURL("https://example.com").
    WithMaxItems(10).
    WithConcurrency(5)

// Set link extractor
builder.WithDomLinkExtractor("a.article-link", "")

// Set content extractor
builder.WithAutoContentExtractor()

// Build feed
feed, err := builder.Build(content)
if err != nil {
    log.Fatal(err)
}
```

### Adding a New Route

```go
router.GET("/my/feed", func(c *gin.Context) {
    // Create feed builder
    builder := feed.NewBuilder().
        WithFeedTitle("My Feed").
        WithEntryURL("https://example.com").
        WithMaxItems(10)

    // Set extractors
    builder.WithDomLinkExtractor("a.article-link", "")
    builder.WithAutoContentExtractor()

    // Build feed
    feedData, err := builder.Build(content)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    // Convert to RSS
    rss, err := feedData.ToGorilla().ToRss()
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.String(200, rss)
})
```

## Project Structure

```
packages/go/
├── main.go           # Main application entry
├── go.mod           # Go module file
├── pkg/             # Package directory
│   ├── cache/       # Cache implementation
│   ├── config/      # Configuration management
│   ├── feed/        # Feed generation
│   ├── html/        # HTML processing
│   └── http/        # HTTP client
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
