package server

import (
	"path/filepath"
	"toast/backend/internals"

	"github.com/gin-gonic/gin"
)

func createEmbedRoute(route *gin.Engine) {
	route.GET("/embed/*filePath", func(ctx *gin.Context) {
		requestedFile := ctx.Param("filePath")
		fileToGet := filepath.Join(internals.EMBED_SAVED_PATH, requestedFile)

		ctx.File(fileToGet)
	})
}
