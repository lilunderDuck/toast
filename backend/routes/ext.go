package routes

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateExtensionRoute(this *gin.RouterGroup) {
	fileDialogDllPath := utils.JoinPath(internals.ResourcesFolderPath, "theBiggestSoundSystem.dll")
	this.GET("/bridge/openFileDialog", func(ctx *gin.Context) {
		call := internals.CallDll(fileDialogDllPath)

		result, err := call("openFileDialog", internals.StringToUintptr("All Files (*.*)"), internals.NULL_PTR)

		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"result": result,
		})
	})
}
