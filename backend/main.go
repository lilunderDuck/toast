package main

import (
	"burned-toast/backend/debug"
	"burned-toast/backend/dynamic"
	"burned-toast/backend/internals"

	// ...
	"burned-toast/backend/routes"
	journal_route "burned-toast/backend/routes/journal"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// the app mode, this will be overwritten to "dev" when in dev mode.
var appMode string = "prod"
var router *gin.Engine

func init() {
	debug.Info("Server will start")
	if appMode == "prod" {
		gin.SetMode(gin.ReleaseMode)
	}

	router = gin.Default()
}

func main() {
	router.Use(cors.Default())
	router.Use(static.Serve("/", static.LocalFile(internals.StaticFolderPath, false)))

	apiRoute := router.Group("/duck")

	journal_route.CreateJournalRoute(apiRoute)
	routes.CreateJournalGroupRoute(apiRoute)
	routes.CreateExtensionRoute(apiRoute)
	routes.CreateMediaRoute(apiRoute)
	go dynamic.CreateServer()
	router.Run(":8000")
}
