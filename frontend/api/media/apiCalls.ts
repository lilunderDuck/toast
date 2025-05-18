import { macro_urlBuilder } from "macro_def"
// ...
import { __callBackendApi } from "../call"

async function saveMediaFile(filePath: string, targetDest: string) {
  return await fetch(`http://localhost:8080/upload?requestedFile=${filePath}&dest=${targetDest}`, {
    method: "POST"
  }).then(it => it.text())
}

export const UPLOAD_ROUTE = "/duck/media/upload" as const
export const DELETE_ROUTE = "/duck/media/delete" as const
export const GET_FILES_ROUTE = "/duck/media/files" as const

export async function api_saveImage(currentGroupId: number, targetFile: string): Promise<{ result: string }> {
  // return __callBackendApi("POST", `/duck/media/image/${currentGroupId}?filePath=${targetFile}`)
  return __callBackendApi("POST", `/duck/journal/${currentGroupId}/image`, {
    filePath: targetFile
  })
}

export function api_deleteImage(currentGroupId: number, fileName: string) {
  return __callBackendApi("DELETE", `/duck/journal/${currentGroupId}/image`, {
    fileName: fileName
  })
}

export function api_saveVideo(currentGroupId: number, targetFilePath: string) {
  return saveMediaFile(targetFilePath, `/journals/${currentGroupId}/vid`)
}

export function api_uploadJournalGroupPreviewIcon(targetFilePath: string) {
  return __callBackendApi("POST", macro_urlBuilder(`/duck/media/preview`, {
    filePath: targetFilePath
  }))
}