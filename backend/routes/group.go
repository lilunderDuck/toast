package routes

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateJournalGroupRoute(this *gin.RouterGroup) {
	this.GET("/journal-group", func(ctx *gin.Context) {
		allJournals := journal.GetAllGroup()
		ctx.JSON(http.StatusOK, allJournals)
	})

	this.GET("/journal-group/:groupId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))

		allJournals, err := journal.GetGroup(groupId)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		ctx.JSON(http.StatusOK, allJournals)
	})

	this.POST("/journal-group", func(ctx *gin.Context) {
		var json journal.JournalGroupSchema
		if err := ctx.ShouldBindJSON(&json); err != nil {
			utils.ReplyWithValidationErrMsg(ctx, err)
			return
		}

		journalData, err := journal.CreateGroup(&json)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		ctx.JSON(http.StatusOK, journalData)
	})

	this.PATCH("/journal-group/:groupId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))

		var json journal.JournalGroupUpdateSchema
		if err := ctx.ShouldBindJSON(&json); err != nil {
			utils.ReplyWithValidationErrMsg(ctx, err)
			return
		}

		journalData, err := journal.UpdateGroup(groupId, &json)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		ctx.JSON(http.StatusOK, journalData)
	})

	this.DELETE("/journal-group/:groupId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))

		journal.DeleteGroup(groupId)
		utils.ReplyWithOkMsg(ctx)
	})

	this.GET("/journal-group/:groupId/tree", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))

		data, err := journal.GetVirTree(groupId)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		ctx.JSON(http.StatusOK, data)
	})

	this.PATCH("/journal-group/:groupId/tree", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		var json journal.VirTreeData
		if err := ctx.ShouldBindJSON(&json); err != nil {
			utils.ReplyWithValidationErrMsg(ctx, err)
			return
		}

		err := journal.SaveVirTree(groupId, json)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		utils.ReplyWithOkMsg(ctx)
	})
}
