package routes

import (
	"net/http"
	"server/handler/journal"
	"server/server"
	"server/utils"

	"github.com/gin-gonic/gin"
)

func HandleJournalRoutes(handleRequest server.RouteCreateFn) {
	const ROUTE_NAME string = "/duck/journal/:groupId"

	handleRequest("GET", ROUTE_NAME, func(context *gin.Context) (int, any, error) {
		return server.NotImplemented()
	})

	handleRequest("POST", ROUTE_NAME, func(context *gin.Context) (int, any, error) {
		var form journal.JournalSchema
		validateError := context.BindJSON(&form)
		if validateError != nil {
			return server.ResponseWithError(http.StatusBadRequest, validateError)
		}

		requestedGroupId := getGroupIdParam(context)

		newData := journal.CreateJournal(requestedGroupId, &form)
		return server.ResponseWithData(http.StatusCreated, newData)
	})

	handleRequest("GET", ROUTE_NAME+"/:journalId", func(context *gin.Context) (int, any, error) {
		groupId, journalId := getGroupAndJournalIdParam(context)
		journalData, anyError := journal.GetJournal(groupId, journalId)
		if anyError != nil {
			return server.ResponseWithError(http.StatusInternalServerError, anyError)
		}

		return server.ResponseWithData(http.StatusNotImplemented, journalData)
	})

	handleRequest("PATCH", ROUTE_NAME+"/:journalId", func(context *gin.Context) (int, any, error) {
		var form journal.JournalUpdateSchema
		validateError := context.BindJSON(&form)
		if validateError != nil {
			return server.ResponseWithError(http.StatusBadRequest, validateError)
		}

		groupId, journalId := getGroupAndJournalIdParam(context)
		newData, anyError := journal.UpdateJournal(groupId, journalId, &form)
		if anyError != nil {
			return server.ResponseWithError(http.StatusInternalServerError, anyError)
		}

		return server.ResponseWithData(http.StatusOK, newData)
	})

	handleRequest("DELETE", ROUTE_NAME+"/:journalId", func(context *gin.Context) (int, any, error) {
		return server.NotImplemented()
	})
}

func getGroupIdParam(context *gin.Context) int {
	requestedGroupId := context.Param("groupId")
	return utils.StringToInt(requestedGroupId)
}

func getGroupAndJournalIdParam(context *gin.Context) (int, int) {
	requestedGroupId := context.Param("journalId")
	return getGroupIdParam(context), utils.StringToInt(requestedGroupId)
}
