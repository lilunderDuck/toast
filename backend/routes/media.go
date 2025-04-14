package routes

import (
	"burned-toast/backend/handler/media"
	"burned-toast/backend/utils"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMediaRoute(this *gin.RouterGroup) {
	mediaRoute := this.Group("/journal-media")

	imageMediaRoute(mediaRoute)
	galleryMediaRoute(mediaRoute)
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
