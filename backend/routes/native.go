package routes

import (
	// "burned-toast/backend/internals"
	"burned-toast/backend/handler/file_dialog"
	"burned-toast/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	EXT_OPEN_FILE_DIALOG uint16 = 1
)

func CreateExtensionRoute(this *gin.Engine) {
	nativeRoute := this.Group("/native")
	nativeRoute.POST("/openFileDialog", func(ctx *gin.Context) {
		var options file_dialog.FileDialogOptions
		if err := ctx.ShouldBindJSON(&options); err != nil {
			utils.ReplyWithValidationErrMsg(ctx, err)
			return
		}

		result, err := file_dialog.OpenFileDialog(&options)

		if err != nil {
			utils.ReplyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"result": result,
		})
	})
}
