package routes

import (
	// "burned-toast/backend/internals"
	"burned-toast/backend/handler/file_dialog"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateExtensionRoute(this *gin.RouterGroup) {
	this.POST("/bridge/openFileDialog", func(ctx *gin.Context) {
		var options file_dialog.FileDialogOptions
		if err := ctx.ShouldBindJSON(&options); err != nil {
			replyWithValidationErrMsg(ctx, err)
			return
		}

		result, err := file_dialog.OpenFileDialog(&options)

		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"result": result,
		})
	})
}
