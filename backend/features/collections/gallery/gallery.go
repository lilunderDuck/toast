package gallery

import "toast/backend/utils"

func (*Exports) Gallery_getByPath(targetPath string) (GalleryData, error) {
	return utils.ReadJsonFile[GalleryData](targetPath + "/meta.json")
}

func (*Exports) Gallery_getEntryByPath(targetPath string) ([]GalleryItemData, error) {
	return utils.ReadJsonFile[[]GalleryItemData](targetPath + "/entries.json")
}
