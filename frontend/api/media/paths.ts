export function api_getImageSavedPath(currentGroupId: number, fileName: string) {
  return `/data/journals/${currentGroupId}/image/${fileName}` as const
}

export function api_getGallerySavedPath(currentGroupId: number, galleryId: number, fileName: string) {
  return `/data/journals/${currentGroupId}/gallery/${galleryId}/${fileName}` as const
}
