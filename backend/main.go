package main

import (
	"burned-toast/backend/dynamic"
	"burned-toast/backend/internals"
	"burned-toast/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/theritikchoure/logx"
)

func init() {
	logx.ColoringEnabled = true // Enable colorized logging
}

func main() {
	router := gin.Default()

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
