package routes

import (
	"net/http"
	"server/handler/misc"
	"server/server"

	"github.com/gin-gonic/gin"
)

func HandleMiscRoutes(handleRequest server.RouteCreateFn) {
	const ROUTE_NAME string = "/duck/misc"

	handleRequest("GET", ROUTE_NAME+"/splash-text", func(context *gin.Context) (int, any, error) {
		randomSplashText, someError := misc.GetRandomSplashText()
		if someError != nil {
			return server.ResponseWithError(http.StatusInternalServerError, someError)
		}

		return server.ResponseWithData(http.StatusOK, &misc.SplashTextResponseData{
			Text: randomSplashText,
		})
	})

	handleRequest("GET", ROUTE_NAME+"/lib-used", func(context *gin.Context) (int, any, error) {
		data, someError := misc.GetLibariesUsedList()
		if someError != nil {
			return server.ResponseWithError(http.StatusInternalServerError, someError)
		}

		return server.ResponseWithData(http.StatusOK, &data)
	})

	// ...
}
