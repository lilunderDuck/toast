package blocks

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/utils"
)

func GetSavedImageFolderPath(groupId int) string {
	return utils.JoinPath(journal.GetGroupPath(groupId), "image")
}

func GetSavedGalleryFolderPath(groupId int, galleryId int) string {
	return utils.JoinPath(
		journal.GetGroupPath(groupId),
		"gallery",
		utils.IntToString(galleryId),
	)
}
