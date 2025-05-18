import { macro_urlBuilder } from "macro_def"
// ...
import { __callBackendApi } from "../call"

export const MEDIA_TYPE__IMAGE = 1
export const MEDIA_TYPE__VIDEO = 2
export const MEDIA_TYPE__NOT_SUPPORTED = 0
export interface IGalleryItemData {
  type: number
  name: string
}

export type GalleryItemResult = {
  name: string
  type: string
}

export function getGalleryItemUrl(currentGroupId: number, galleryId: string, fileName: string) {
  return `http://localhost:8080/dynamic/journals/${currentGroupId}/gallery/${galleryId}/${fileName}` as const
}

export async function api_getGallery(
  currentGroupId: number, 
  galleryId: string,
): Promise<IGalleryItemData[]> {
  return __callBackendApi("GET", `/duck/journal/${currentGroupId}/gallery/${galleryId}`)
}

export async function api_saveGalleryItem(
  currentGroupId: number, 
  galleryId: string, 
  targetFile: string
): Promise<IGalleryItemData> {
  console.log(currentGroupId, galleryId, targetFile)
  return __callBackendApi("POST", macro_urlBuilder(`/duck/journal/${currentGroupId}/gallery/${galleryId}`, {
    filePath: targetFile,
  }))
}

export function api_deleteGalleryItem(
  currentGroupId: number, 
  galleryId: string, 
  fileName: string
) {
  return __callBackendApi("DELETE", macro_urlBuilder(`/duck/journal/${currentGroupId}/gallery/${galleryId}`, {
    filePath: fileName
  }))
}
