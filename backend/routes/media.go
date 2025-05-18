package routes

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMediaRoute(this *gin.RouterGroup) {
	mediaRoute := this.Group("/media")

	// POST /api/media/upload?filePath=...&dest=...
	mediaRoute.POST("/upload", func(ctx *gin.Context) {
		data, err := utils.HandleFileUpload(ctx, internals.DataFolderPath)
		if err == nil {
			ctx.JSON(http.StatusOK, data)
		}
	})

	// POST /api/media/delete?filePath=...
	mediaRoute.POST("/delete", func(ctx *gin.Context) {
		data, err := utils.HandleFileDelete(ctx, internals.JournalFolderPath)
		if err == nil {
			ctx.JSON(http.StatusOK, data)
		}
	})

	previewJournalGroupIconRoute(mediaRoute)
}

func previewJournalGroupIconRoute(this *gin.RouterGroup) {
	this.POST("/preview", func(ctx *gin.Context) {
		filePath := ctx.Query("filePath")
		if !shouldProcessImage(ctx, filePath) {
			return
		}

		err := utils.CopyFile(filePath, utils.JoinPath(internals.JournalFolderPath, "preview.png"))
		if err != nil {
			utils.ReplyWithAnyErrMsg(ctx, err)
			return
		}

		utils.ReplyWithOkMsg(ctx)
	})
}

func shouldProcessImage(ctx *gin.Context, filePath string) bool {
	if filePath == "" {
		utils.ReplyWithValidationErrMsg(ctx, errors.New("missing 'filePath' query parameter."))
		return false
	}

	if !utils.IsFileExist(filePath) {
		utils.ReplyWithAnyErrMsg(ctx, fmt.Errorf("file %s doesn't exist.", filePath))
		return false
	}

	return true
}
