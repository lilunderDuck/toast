package routes

import (
	"net/http"
	"server/server"

	"github.com/gin-gonic/gin"
)

func HandlePingRoutes(handleRequest server.RouteCreateFn) {
	handleRequest("GET", "/ping", func(context *gin.Context) (int, any, error) {
		return server.ResponseWithData(http.StatusOK, &gin.H{
			"reply": "pong",
			"message": "duck from the other side is alive!",
		})
	})
}
