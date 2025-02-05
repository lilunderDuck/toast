package server

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RouteHandler func(context *gin.Context) (status int, data any, someKindOfError error)
type RouteCreateFn func(method string, route string, thisRouteHandler RouteHandler)

func CreateRouter(router *gin.Engine) RouteCreateFn {
	return func(method string, route string, thisRouteHandler RouteHandler) {
		switch method {
		case "GET":
			router.GET(route, handle(thisRouteHandler))
		case "POST":
			router.POST(route, handle(thisRouteHandler))
		case "PATCH":
			router.PATCH(route, handle(thisRouteHandler))
		case "DELETE":
			router.DELETE(route, handle(thisRouteHandler))
		default:
			panic(fmt.Sprintf("hasn't handled method %s yet", method))
		}
	}
}

func handle(handler RouteHandler) gin.HandlerFunc {
	return func(context *gin.Context) {
		statusCode, data, someError := handler(context)
		if someError != nil {
			context.JSON(statusCode, gin.H{
				"error":   someError.Error(),
				"status":  statusCode,
				"message": "We have some problem boy.",
			})
			return
		}

		if data == nil {
			context.JSON(statusCode, gin.H{
				"status":  statusCode,
				"message": "There's no data here...",
			})
			return
		}

		context.JSON(statusCode, &data)
	}
}

func ResponseWithError(status int, someError error) (httpStatus int, data any, someKindOfError error) {
	return status, nil /* no data */, someError
}

func ResponseWithData(status int, data any) (httpStatus int, anyData any, someKindOfError error) {
	return status, data, nil /* no error */
}

func NotImplemented() (httpStatus int, anyData any, someKindOfError error) {
	return ResponseWithError(http.StatusNotImplemented, fmt.Errorf("this route hasn't been implemented yet."))
}
