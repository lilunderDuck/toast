package journal_route

import (
	"burned-toast/backend/handler/editor_data"
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func galleryJournalRoute(this *gin.RouterGroup) {
	this.GET("/journal/:groupId/gallery/:galleryId", func(ctx *gin.Context) {
		// groupId := utils.StringToInt(ctx.Param("groupId"))
		galleryId := ctx.Param("galleryId")
		thisGallery := editor_data.GalleryData{
			GalleryId: galleryId,
		}

		data, err := thisGallery.GetAll()
		if err != nil {
			utils.ReplyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, data)
	})

	this.POST("/journal/:groupId/gallery/:galleryId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		galleryId := ctx.Param("galleryId")

		thisGallery := editor_data.GalleryData{
			GalleryId: galleryId,
		}

		currentGalleryPath := thisGallery.GetSavedPath(groupId)
		// still don't have check to see if this gallery path exists
		utils.CreateDirectory(currentGalleryPath)

		fileUploaded, err := utils.HandleFileUpload(ctx, currentGalleryPath)
		if err != nil {
			return
		}

		data, err := thisGallery.Save(groupId, fileUploaded.Name, fileUploaded.Type)
		if err != nil {
			utils.ReplyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"type": data.Type,
			"name": data.Name,
		})
	})

	this.DELETE("/journal/:groupId/gallery/:galleryId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		galleryId := ctx.Param("galleryId")

		currentGroupPath := internals.GetGroupPath(groupId)
		fileDeleted, err := utils.HandleFileDelete(ctx, currentGroupPath)
		if err != nil {
			return // responsed with error already
		}

		thisGallery := editor_data.GalleryData{
			GalleryId: galleryId,
		}

		thisGallery.Delete(utils.GetFileNameWithExtension(fileDeleted))

		utils.ReplyWithOkMsg(ctx)
	})
}
