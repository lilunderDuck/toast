package media

import (
	"burned-toast/backend/internals"
	"burned-toast/backend/utils"
)

func GetSavedImageFolderPath(groupId int) string {
	return utils.JoinPath(internals.GetGroupPath(groupId), "image")
}

func GetSavedGalleryFolderPath(groupId int, galleryId int) string {
	return utils.JoinPath(
		internals.GetGroupPath(groupId),
		"gallery",
		utils.IntToString(galleryId),
	)
}
