package journal_route

import "github.com/gin-gonic/gin"

func CreateJournalRoute(this *gin.RouterGroup) {
	galleryJournalRoute(this)
	contentRoute(this)
}
