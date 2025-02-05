package routes

import (
	"server/server"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func ServeStaticFiles(router *gin.Engine) {
	router.Use(static.Serve("/", static.LocalFile(server.AppStaticFilesPath, false)))
	// router.StaticFS("/more_static", http.Dir("my_file_system"))
}
