package main

import (
	"fmt"
	"log"

	"theosun/RSSHub/packages/go/pkg/config"
	"theosun/RSSHub/packages/go/pkg/subscriptions"

	"github.com/gin-gonic/gin"
)

var (
	configManager *config.Manager
)

func init() {
	// Initialize configuration
	configManager = config.NewManager()
	configManager.LoadEnv()
}

func main() {
	cfg := configManager.Get()

	// Create gin e
	e := gin.Default()

	// Add middleware
	e.Use(gin.Recovery())

	// Add routes
	e.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"title":       "RSSHub",
			"description": "Everything is RSSible",
		})
	})

	subscriptions.MountSubscriptions(e)

	// Start server
	addr := fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Starting server on %s", addr)
	if err := e.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
