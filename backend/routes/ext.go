package routes

import (
	"burned-toast/backend/internals"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateExtensionRoute(this *gin.RouterGroup) {
	// this still doesn't work
	this.GET("/bridge/openFileDialog", func(ctx *gin.Context) {
		result, err := internals.CallDll(
			internals.FileDialogLibPath,
			"openFileDialog",
			internals.StringToUintptr("Hello"),
			internals.StringToUintptr("All files\000*.*"),
			internals.NULL_PTR,
		)

		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"result": result,
		})
	})
}
