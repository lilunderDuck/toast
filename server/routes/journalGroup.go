package routes

import (
	"net/http"
	// ...
	"server/handler/journal_group"
	"server/server"
	"server/utils"

	// ...
	"github.com/gin-gonic/gin"
)

func getParam(context *gin.Context) int {
	requestedGroupId := context.Param("id")
	return utils.StringToInt(requestedGroupId)
}

func HandleJournalGroupRoutes(handleRequest server.RouteCreateFn) {
	const ROUTE_NAME string = "/duck/journal-group"

	handleRequest("GET", ROUTE_NAME, func(context *gin.Context) (int, any, error) {
		return server.ResponseWithData(http.StatusOK, journal_group.GetAll())
	})

	handleRequest("GET", ROUTE_NAME+"/:id", func(context *gin.Context) (int, any, error) {
		groupId := getParam(context)

		data, getError := journal_group.Get(groupId)
		if getError != nil {
			return server.ResponseWithError(http.StatusBadRequest, getError)
		}

		return server.ResponseWithData(http.StatusOK, &data)
	})

	handleRequest("POST", ROUTE_NAME, func(context *gin.Context) (int, any, error) {
		var form journal_group.Schema
		validateError := context.BindJSON(&form)
		if validateError != nil {
			return server.ResponseWithError(http.StatusBadRequest, validateError)
		}

		newGroup, createError := journal_group.Create(&form)
		if createError != nil {
			return server.ResponseWithError(http.StatusInternalServerError, createError)
		}

		return server.ResponseWithData(http.StatusCreated, &newGroup)
	})

	handleRequest("PATCH", ROUTE_NAME+"/:id", func(context *gin.Context) (int, any, error) {
		var form journal_group.UpdateSchema
		validateError := context.BindJSON(&form)
		if validateError != nil {
			return server.ResponseWithError(http.StatusBadRequest, validateError)
		}

		requestedGroupId := getParam(context)
		newData, someError := journal_group.Update(requestedGroupId, &form)
		if someError != nil {
			return server.ResponseWithError(http.StatusNotFound, someError)
		}

		return server.ResponseWithData(http.StatusOK, &newData)
	})

	handleRequest("DELETE", ROUTE_NAME+"/:id", func(context *gin.Context) (int, any, error) {
		requestedGroupId := getParam(context)
		deleteError := journal_group.Delete(requestedGroupId)
		if deleteError != nil {
			return server.ResponseWithError(http.StatusNotFound, deleteError)
		}

		return server.ResponseWithData(http.StatusOK, nil)
	})
}
