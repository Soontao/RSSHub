package subscriptions

import "github.com/gin-gonic/gin"

// Register subscriptions
func MountSubscriptions(r *gin.Engine) {
	r.GET("/appinn", AppinnSubscription())
}
