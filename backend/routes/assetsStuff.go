package routes

import (
	// "net/http"
	// "path/filepath"

	"burned-toast/backend/internals"
	"burned-toast/backend/utils"

	"github.com/gin-gonic/gin"
)

func CreateAssetsRoute(this *gin.Engine) {
	assetsRoute := this.Group("/assets")
	assetsRoute.GET("/emoji/:emoji_name", func(ctx *gin.Context) {
		requestedEmojiName := ctx.Param("emoji_name")

		ctx.File(utils.JoinPath(internals.StaticFolderPath, "emoji", requestedEmojiName))
	})
}
