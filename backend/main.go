package main

import (
	"burned-toast/backend/dynamic"
	"burned-toast/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/theritikchoure/logx"
)

func init() {
	logx.ColoringEnabled = true // Enable colorized logging
}

func main() {
	router := gin.Default()
	// router.Use(cors.New(cors.Config{
	// 	AllowCredentials: true,
	// 	AllowOrigins: []string{"http://localhost:1337"},
	// 	AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	// }))
	router.Use(cors.Default())
	apiRoute := router.Group("/duck")

	routes.CreateJournalRoute(apiRoute)
	routes.CreateJournalGroupRoute(apiRoute)
	routes.CreateExtensionRoute(apiRoute)
	go dynamic.CreateServer()
	router.Run(":8000")
}
