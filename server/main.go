package main

import (
	"server/routes"
	"server/server"
	"server/utils"

	// ...
	"github.com/gin-gonic/gin"
)

// the app mode, can be empty string "" or "release"
var mode string

func main() {
	if mode == "" {
		mode = "debug"
	}

	gin.SetMode(mode)
	router := gin.Default()
	if mode != "release" {
		router.Use(server.DealWithCORSCuzItsStupid())
	}

	handleRequest := server.CreateRouter(router)

	// serve static files
	routes.ServeStaticFiles(router)
	// routes and stuffs will be here
	routes.HandleJournalRoutes(handleRequest)
	routes.HandleJournalGroupRoutes(handleRequest)
	routes.HandleMiscRoutes(handleRequest)
	// open the web browser in release mode
	if mode == "release" {
		utils.OpenBrowser("http://localhost:8000")
	}

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	// quite handly because:
	// - you can set the port number
	// - also a workaround to deal with the stupid Windows Defender every dang time I run this app on development.
	// Actually, the full warning is:
	//         windows defender firewall has blocked some features.
	// This is stupid.
	// Actually not, false positives*
	router.Run("localhost:8000")
}
