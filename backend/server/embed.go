package server

import (
	internal "toast/backend/internals"
	"toast/backend/utils"

	"github.com/gin-gonic/gin"
)

func createEmbedRoute(route *gin.Engine) {
	basePath := utils.JoinPath(internal.DATA_FOLDER_PATH, "embed")
	// luaRuntime := lua_runtime.Load()

	route.GET("/embed/*filePath", func(ctx *gin.Context) {
		requestedFile := ctx.Param("filePath")
		fileToGet := utils.JoinPath(basePath, requestedFile)
		if utils.GetFileExtension(fileToGet) == ".lua" {
			// pass := runScript(ctx, luaRuntime, fileToGet)
			// if !pass {
			// return
			// }
		}

		ctx.File(fileToGet)
	})
}
