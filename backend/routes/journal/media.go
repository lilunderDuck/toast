package journal_route

import (
	"burned-toast/backend/internals"

	"github.com/gin-gonic/gin"
)

func mediaStuff(this *gin.RouterGroup) {
	this.POST("/media", func(ctx *gin.Context) {
		handleSaving(ctx, func(groupId int) string {
			return internals.GetGroupPath(groupId)
		})
	})

	this.DELETE("/media", func(ctx *gin.Context) {
		handleDelete(ctx, func(groupId int) string {
			return internals.GetGroupPath(groupId)
		})
	})
}
