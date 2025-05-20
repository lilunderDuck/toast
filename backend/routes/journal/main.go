package journal_route

import "github.com/gin-gonic/gin"

func CreateJournalRoute(this *gin.RouterGroup) {
	journalRoute := this.Group("/journal/:groupId")
	galleryJournalRoute(journalRoute)
	contentRoute(journalRoute)
	mediaStuff(journalRoute)
}
