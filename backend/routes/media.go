package routes

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/handler/media"
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMediaRoute(this *gin.RouterGroup) {
	mediaRoute := this.Group("/journal-media")

	// POST /api/journal-media/upload?filePath=...&dest=...
	mediaRoute.POST("/upload", func(ctx *gin.Context) {
		filePath := ctx.Query("filePath")
		dest := ctx.Query("dest")
		if filePath == "" {
			replyWithValidationErrMsg(ctx, errors.New("missing 'filePath' query parameter"))
			return
		}

		if dest == "" {
			replyWithValidationErrMsg(ctx, errors.New("missing 'dest' query parameter"))
			return
		}

		err := utils.CopyFile(filePath, utils.JoinPath(internals.DataFolderPath, dest))
		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		replyWithOkMsg(ctx)
	})

	// POST /api/journal-media/delete?filePath=...
	mediaRoute.POST("/delete", func(ctx *gin.Context) {
		filePath := ctx.Query("filePath")
		err := utils.RemoveFileOrDirectory(utils.JoinPath(journal.JournalFolderPath, filePath))
		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		replyWithOkMsg(ctx)
	})

	imageMediaRoute(mediaRoute)
	galleryMediaRoute(mediaRoute)
	previewJournalGroupIconRoute(mediaRoute)
}

func previewJournalGroupIconRoute(this *gin.RouterGroup) {
	this.POST("/preview", func(ctx *gin.Context) {
		filePath := ctx.Query("filePath")
		if !shouldProcessImage(ctx, filePath) {
			return
		}

		err := utils.CopyFile(filePath, utils.JoinPath(journal.JournalFolderPath, "preview.png"))
		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		replyWithOkMsg(ctx)
	})
}

func imageMediaRoute(this *gin.RouterGroup) {
	// POST /image/:groupId?filePath=...
	this.POST("/image/:groupId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		filePath := ctx.Query("filePath")
		if !shouldProcessImage(ctx, filePath) {
			return
		}

		filePath, err := media.SaveImage(groupId, filePath)
		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"result": filePath,
		})
	})

	this.DELETE("/image/:groupId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		filePath := ctx.Query("filePath")
		if !shouldProcessImage(ctx, filePath) {
			return
		}

		media.DeleteImage(groupId, filePath)
		replyWithOkMsg(ctx)
	})
}

func galleryMediaRoute(this *gin.RouterGroup) {
	// POST /gallery/:groupId/:galleryId?filePath=...
	this.POST("/gallery/:groupId/:galleryId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		galleryId := utils.StringToInt(ctx.Param("galleryId"))
		filePath := ctx.Query("filePath")
		if !shouldProcessImage(ctx, filePath) {
			return
		}

		filePath, err := media.SaveGalleryImage(groupId, galleryId, filePath)
		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"result": filePath,
		})
	})

	this.DELETE("/gallery/:groupId/:galleryId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		galleryId := utils.StringToInt(ctx.Param("galleryId"))
		filePath := ctx.Query("filePath")
		if !shouldProcessImage(ctx, filePath) {
			return
		}

		media.DeleteGalleryImage(groupId, galleryId, filePath)
		replyWithOkMsg(ctx)
	})
}

func shouldProcessImage(ctx *gin.Context, filePath string) bool {
	if filePath == "" {
		replyWithValidationErrMsg(ctx, errors.New("missing 'filePath' query parameter."))
		return false
	}

	if !utils.IsFileExist(filePath) {
		replyWithAnyErrMsg(ctx, fmt.Errorf("file %s doesn't exist.", filePath))
		return false
	}

	return true
}
