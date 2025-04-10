package routes

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func CreateJournalRoute(this *gin.RouterGroup) {
	this.GET("/journal/:groupId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))

		allJournals := journal.GetAllJournal(groupId)
		ctx.JSON(http.StatusOK, allJournals)
	})

	this.GET("/journal/:groupId/:journalId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		journalId := utils.StringToInt(ctx.Param("journalId"))

		journalData, err := journal.GetJournal(groupId, journalId)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		fmt.Printf("%v\n", journalData)

		jsonData, err := jsoniter.Marshal(journalData)
		if err != nil {
			replyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, utils.BytesToString(jsonData))
	})

	this.POST("/journal/:groupId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))

		var json journal.JournalSchema
		if err := ctx.ShouldBindJSON(&json); err != nil {
			replyWithValidationErrMsg(ctx, err)
			return
		}

		journalData := journal.CreateJournal(groupId, &json)
		ctx.JSON(http.StatusOK, journalData)
	})

	this.PATCH("/journal/:groupId/:journalId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		journalId := utils.StringToInt(ctx.Param("journalId"))

		var json journal.JournalUpdateSchema
		if err := ctx.ShouldBindJSON(&json); err != nil {
			replyWithValidationErrMsg(ctx, err)
			return
		}

		journalData, err := journal.UpdateJournal(groupId, journalId, &json)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		ctx.JSON(http.StatusOK, journalData)
	})

	this.DELETE("/journal/:groupId/:journalId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		journalId := utils.StringToInt(ctx.Param("journalId"))

		journal.DeleteJournal(groupId, journalId)
		replyWithOkMsg(ctx)
	})
}
