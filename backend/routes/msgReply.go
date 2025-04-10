package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func replyWithOkMsg(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"ok": "👍",
	})
}

func replyWithValidationErrMsg(ctx *gin.Context, anyError error) {
	ctx.JSON(http.StatusBadRequest, gin.H{
		"error":   anyError.Error(),
		"message": "Bad data requested",
	})
}

func replyWithAnyErrMsg(ctx *gin.Context, anyError error) {
	ctx.JSON(http.StatusInternalServerError, gin.H{
		"error":   anyError.Error(),
		"message": "There's some funky stuff goin' on",
	})
}
