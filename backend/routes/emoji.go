package routes

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
	"fmt"

	"github.com/gin-gonic/gin"
)

func CreateEmojiRoute(this *gin.RouterGroup) {
	this.GET("/emoji/:emoji_name", func(ctx *gin.Context) {
		requestedEmojiName := ctx.Param("emoji_name")
		switch requestedEmojiName {
		case "idk":
			// ...
		default:
			utils.ReplyWithAnyErrMsg(ctx, fmt.Errorf("emoji name \"%s\" does not exit", requestedEmojiName))
			return
		}

		ctx.File(utils.JoinPath(internals.StaticFolderPath, "emoji", requestedEmojiName))
	})
}
