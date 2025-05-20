package journal_route

import (
	"burned-toast/backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MediaUploadSchema struct {
	FilePath   string `form:"filePath"     json:"filePath"    binding:"required"`
	FolderPath string `form:"folderPath"   json:"folderPath"  binding:"required"`
}

func validateMediaUploadStuff(ctx *gin.Context) *MediaUploadSchema {
	var this MediaUploadSchema
	if !utils.Validate(ctx, &this) {
		return nil
	}

	return &this
}

type MediaDeleteSchema struct {
	FileName   string `form:"fileName"     json:"fileName"    binding:"required"`
	FolderPath string `form:"folderPath"   json:"folderPath"  binding:"required"`
}

func validateMediaDeleteStuff(ctx *gin.Context) *MediaDeleteSchema {
	var this MediaDeleteSchema
	if !utils.Validate(ctx, &this) {
		return nil
	}

	return &this
}

func getRequestedFile(
	ctx *gin.Context,
	filePath GetFilePathFn,
) (_requestedFile string, _saveLocation string, ok bool) {
	groupId := utils.StringToInt(ctx.Param("groupId"))
	requestedFile := validateMediaUploadStuff(ctx)
	if requestedFile == nil {
		return "", "", false
	}

	whereToSave := utils.JoinPath(filePath(groupId), requestedFile.FolderPath)
	return requestedFile.FilePath, whereToSave, true
}

type GetFilePathFn func(groupId int) string

func handleSaving(ctx *gin.Context, filePath GetFilePathFn) {
	requestedFilePath, saveLocation, ok := getRequestedFile(ctx, filePath)
	if !ok {
		return
	}

	err := utils.CreateDirectory(saveLocation)
	if err != nil {
		utils.ReplyWithAnyErrMsg(ctx, err)
		return
	}

	newFileName, err := saveAnyFile(requestedFilePath, saveLocation)
	if err != nil {
		utils.ReplyWithAnyErrMsg(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"result": newFileName,
	})
}

func getRequestedFileName(
	ctx *gin.Context,
	filePath GetFilePathFn,
) (_targetFilePath string, ok bool) {
	groupId := utils.StringToInt(ctx.Param("groupId"))
	requestedFile := validateMediaDeleteStuff(ctx)
	if requestedFile == nil {
		return "", false
	}

	whereToSave := utils.JoinPath(filePath(groupId), requestedFile.FolderPath)
	return utils.JoinPath(whereToSave, requestedFile.FileName), true
}

func handleDelete(ctx *gin.Context, filePath GetFilePathFn) {
	requestedFilePath, ok := getRequestedFileName(ctx, filePath)
	if !ok {
		return
	}

	err := utils.RemoveFileOrDirectory(requestedFilePath)
	if err != nil {
		utils.ReplyWithAnyErrMsg(ctx, err)
		return
	}

	utils.ReplyWithOkMsg(ctx)
}

// Decodes a string encoded image string and saves it to a file.
// If the file already exists, it creates a new file with a unique name.
//
// Returns the name of the saved image file.
//
// Parameters:
//   - path: The desired file path to save the image.
func saveAnyFile(fromPath string, toPath string) (string, error) {
	fileName := utils.GetFileNameWithExtension(fromPath)
	// makes sure not to overwrite the old file.
	if utils.IsFileExist(fromPath) {
		fileName = createNewFileName(fromPath)
	}

	err := utils.CopyFile(fromPath, utils.JoinPath(toPath, fileName))
	if err != nil {
		return "", err
	}

	return fileName, nil
}

// Generates a new file path with a unique name.
// It appends a random ID to the original file name to avoid conflicts.
//
// Returns the new unique file path.
//
// Parameters:
//   - path: The original file path.
func createNewFileName(path string) string {
	fullFileName := utils.GetFileNameWithExtension(path)
	fileExtension := utils.GetFileExtension(path)
	fileName := fullFileName[:len(fullFileName)-len(fileExtension)]

	println("file creation debug", fullFileName, fileExtension, fileName)

	randomId, _ := utils.GetRandomIntString()
	fileName = fmt.Sprintf(
		"%s-%s%s",
		fileName,      // original file name
		randomId,      // with a random id
		fileExtension, // close off with the file's original extension
	)
	println(fileName)

	return fileName
}
