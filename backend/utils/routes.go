package utils

import (
	"errors"
	"net/http"

	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
)

func ReplyWithOkMsg(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"ok": "👍",
	})
}

func ReplyWithValidationErrMsg(ctx *gin.Context, anyError error) {
	ctx.JSON(http.StatusBadRequest, gin.H{
		"error":   anyError.Error(),
		"message": "Bad data requested",
	})
}

func ReplyWithAnyErrMsg(ctx *gin.Context, anyError error) {
	ctx.JSON(http.StatusInternalServerError, gin.H{
		"error":   anyError.Error(),
		"message": "There's some funky stuff goin' on",
	})
}

func Validate[T any](ctx *gin.Context, jsonInput T) (ok bool) {
	err := ctx.ShouldBindJSON(jsonInput)
	if err != nil {
		ReplyWithValidationErrMsg(ctx, err)
		return false
	}

	return true
}

type MediaUploadSchema struct {
	FilePath string `form:"filePath"  json:"filePath" binding:"required"`
}

func ValidateMediaUploadStuff(ctx *gin.Context) *MediaUploadSchema {
	var this MediaUploadSchema
	if !Validate(ctx, &this) {
		return nil
	}

	return &this
}

type MediaDeleteSchema struct {
	FileName string `form:"fileName"  json:"fileName" binding:"required"`
}

func ValidateMediaDeleteStuff(ctx *gin.Context) *MediaDeleteSchema {
	var this MediaDeleteSchema
	if !Validate(ctx, &this) {
		return nil
	}

	return &this
}

type FileUploadResult struct {
	Name string
	Type string
}

var (
	missingFilePathQuery            = errors.New("missing 'filePath' query parameter")
	missingFileDestinationPathQuery = errors.New("missing 'dest' query parameter")
)

func HandleFileUpload(ctx *gin.Context, dest string) (*FileUploadResult, error) {
	filePath := ctx.Query("filePath")
	if dest == "" {
		dest = ctx.Query("dest")
	}

	if filePath == "" {
		ReplyWithValidationErrMsg(ctx, missingFilePathQuery)
		return nil, missingFilePathQuery
	}

	if dest == "" {
		ReplyWithValidationErrMsg(ctx, missingFileDestinationPathQuery)
		return nil, missingFileDestinationPathQuery
	}

	mineType, err := mimetype.DetectFile(filePath)
	if err != nil {
		ReplyWithAnyErrMsg(ctx, err)
		return nil, err
	}

	err = CopyFile(filePath, JoinPath(dest, GetFileNameWithExtension(filePath)))
	if err != nil {
		ReplyWithAnyErrMsg(ctx, err)
		return nil, err
	}

	data := &FileUploadResult{
		Name: GetFileNameWithExtension(filePath),
		Type: mineType.String(),
	}

	return data, nil
}

func HandleFileDelete(ctx *gin.Context, baseDirectory string) (string, error) {
	filePath := ctx.Query("filePath")
	fileToDelete := JoinPath(baseDirectory, filePath)
	err := RemoveFileOrDirectory(fileToDelete)
	if err != nil {
		ReplyWithAnyErrMsg(ctx, err)
		return "", err
	}

	ReplyWithOkMsg(ctx)
	return fileToDelete, nil
}
