package journal_route

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

func contentRoute(this *gin.RouterGroup) {
	this.GET("", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))

		allJournals := journal.GetAllJournal(groupId)
		ctx.JSON(http.StatusOK, allJournals)
	})

	this.GET("/:journalId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		journalId := utils.StringToInt(ctx.Param("journalId"))

		journalData, err := journal.GetJournal(groupId, journalId)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		fmt.Printf("%v\n", journalData)

		// force to marshal this because idk why the server keep crashing.
		jsonData, err := jsoniter.Marshal(journalData)
		if err != nil {
			utils.ReplyWithAnyErrMsg(ctx, err)
			return
		}

		ctx.JSON(http.StatusOK, utils.BytesToString(jsonData))
	})

	this.POST("", handleCreateAllKindOfJournal)

	this.PATCH("/:journalId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		journalId := utils.StringToInt(ctx.Param("journalId"))

		var json journal.JournalUpdateSchema
		if err := ctx.ShouldBindJSON(&json); err != nil {
			utils.ReplyWithValidationErrMsg(ctx, err)
			return
		}

		journalData, err := journal.UpdateJournal(groupId, journalId, &json)
		if err != nil {
			ctx.JSON(http.StatusNotFound, err)
			return
		}

		ctx.JSON(http.StatusOK, journalData)
	})

	this.DELETE("/:journalId", func(ctx *gin.Context) {
		groupId := utils.StringToInt(ctx.Param("groupId"))
		journalId := utils.StringToInt(ctx.Param("journalId"))

		journal.DeleteJournal(groupId, journalId)
		utils.ReplyWithOkMsg(ctx)
	})
}

func handleCreateAllKindOfJournal(ctx *gin.Context) {
	journalType := ctx.Query("type")
	groupId := utils.StringToInt(ctx.Param("groupId"))

	switch journalType {
	case "":
		utils.ReplyWithValidationErrMsg(ctx, fmt.Errorf("missing query param: 'type'"))
		return
	case "0":
		var json journal.JournalSchema
		if !utils.Validate(ctx, &json) {
			return
		}

		journalData := journal.CreateJournal(groupId, &json)
		ctx.JSON(http.StatusOK, journalData)
		return
	case "1":
		var input journal.CategorySchema
		if !utils.Validate(ctx, &input) {
			return
		}

		data := journal.CreateCategory(groupId, &input)
		ctx.JSON(http.StatusOK, data)
		return
	}
}
