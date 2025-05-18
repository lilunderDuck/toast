package journal_route

import (
	"burned-toast/backend/handler/editor_data"
	"burned-toast/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func mediaStuff(this *gin.RouterGroup) {
	this.POST("/journal/:groupId/image", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		requestedFile := utils.ValidateMediaUploadStuff(ctx)
		if requestedFile == nil {
			return
		}

		imgData := editor_data.NewImageData(requestedFile.FilePath)
		err := imgData.Save(groupId, requestedFile.FilePath)
		if err != nil {
			utils.ReplyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"result": imgData.ImgName,
		})
	})

	this.DELETE("/journal/:groupId/image", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		requestedFile := utils.ValidateMediaDeleteStuff(ctx)
		if requestedFile == nil {
			return
		}

		imgData := editor_data.NewImageData(
			utils.JoinPath(editor_data.GetImageSavedPath(groupId), requestedFile.FileName),
		)

		imgData.Delete(groupId)
		utils.ReplyWithOkMsg(ctx)
	})
}
