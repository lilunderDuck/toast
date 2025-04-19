export function api_getImageSavedPath(currentGroupId: number, fileName: string) {
  return `http://localhost:8080/dynamic/journals/${currentGroupId}/image/${fileName}` as const
}

export function api_getGallerySavedPath(currentGroupId: number, galleryId: number, fileName: string) {
  return `http://localhost:8080/dynamic/journals/${currentGroupId}/gallery/${galleryId}/${fileName}` as const
}

export function api_getVideoSavedPath(currentGroupId: number, fileName: string) {
  return `http://localhost:8080/dynamic/journals/${currentGroupId}/vid/${fileName}` as const
}

export function api_getJournalGroupIconPath(currentGroupId: number) {
  return `http://localhost:8080/dynamic/journals/${currentGroupId}/icon.png` as const
}