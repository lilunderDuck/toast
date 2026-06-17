package gallery

import "toast/backend/utils"

type Exports struct{}

func IsValidStructure(targetPath string) bool {
	hasMetadataFiles :=
		utils.IsFileExist(targetPath+"/entries.json") &&
			utils.IsFileExist(targetPath+"/meta.json")
	isGalleryFolderStructure := utils.IsDirectoryExist(targetPath + "/entry")
	return hasMetadataFiles && isGalleryFolderStructure
}

func ReadMetadata(targetPath string) (GalleryData, error) {
	return utils.ReadJsonFile[GalleryData](targetPath + "/meta.json")
}
