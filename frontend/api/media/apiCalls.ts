import { __callBackendApi } from "../call"

async function saveMediaFile(filePath: string, targetDest: string) {
  return await fetch(`http://localhost:8080/upload?requestedFile=${filePath}&dest=${targetDest}`, {
    method: "POST"
  }).then(it => it.text())
}

export async function api_saveImage(currentGroupId: number, targetFile: string): Promise<{ result: string }> {
  return __callBackendApi("POST", `/duck/journal-media/image/${currentGroupId}?filePath=${targetFile}`)
}

export function api_deleteImage(currentGroupId: number, fileName: string) {
  return __callBackendApi("DELETE", `/duck/journal-media/image/${currentGroupId}?fileName=${fileName}`)
}

export async function api_saveGalleryImage(currentGroupId: number, galleryId: number, targetFile: string): Promise<{ result: string }> {
  return __callBackendApi("POST", `/duck/journal-media/gallery/${currentGroupId}/${galleryId}/?filePath=${targetFile}`)
}

export function api_deleteGalleryImage(currentGroupId: number, galleryId: number, fileName: string) {
  return __callBackendApi("DELETE", `/duck/journal-media/gallery/${currentGroupId}/${galleryId}/?fileName=${fileName}`)
}

export function api_saveVideo(currentGroupId: number, targetFilePath: string) {
  return saveMediaFile(targetFilePath, `/journals/${currentGroupId}/vid`)
}

export function api_uploadJournalGroupPreviewIcon(targetFilePath: string) {
  return __callBackendApi("POST", `/duck/journal-media/preview?filePath=${targetFilePath}`)
}