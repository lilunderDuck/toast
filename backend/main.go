package main

import (
	"burned-toast/backend/dynamic"
	"burned-toast/backend/internals"
	"burned-toast/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// the app mode, this will be overwritten to "dev" when in dev mode.
var appMode string = "prod"
var router *gin.Engine

func init() {
	if appMode == "prod" {
		gin.SetMode(gin.ReleaseMode)
	}

	router = gin.Default()
}

func main() {
	router.Use(cors.Default())
	router.Use(static.Serve("/", static.LocalFile(internals.StaticFolderPath, false)))

	apiRoute := router.Group("/duck")

	routes.CreateJournalRoute(apiRoute)
	routes.CreateJournalGroupRoute(apiRoute)
	routes.CreateExtensionRoute(apiRoute)
	routes.CreateMediaRoute(apiRoute)
	go dynamic.CreateServer()
	router.Run(":8000")
}
