import { macro_urlBuilder } from "macro_def"
// ...
import { __callBackendApi } from "../call"

export async function api_saveImage(currentGroupId: number, targetFile: string): Promise<{ result: string }> {
  return __callBackendApi("POST", `/duck/journal/${currentGroupId}/media`, {
    filePath: targetFile,
    folderPath: "image"
  })
}

export function api_deleteImage(currentGroupId: number, fileName: string) {
  return __callBackendApi("DELETE", `/duck/journal/${currentGroupId}/media`, {
    fileName: fileName,
    folderPath: "image"
  })
}

export function api_saveVideo(currentGroupId: number, targetFilePath: string): Promise<{ result: string }> {
  return __callBackendApi("POST", `/duck/journal/${currentGroupId}/media`, {
    filePath: targetFilePath,
    folderPath: "video"
  })
}

export function api_saveDelete(currentGroupId: number, targetFileName: string) {
  return __callBackendApi("DELETE", `/duck/journal/${currentGroupId}/media`, {
    filePath: targetFileName,
    folderPath: "video"
  })
}

export function api_uploadJournalGroupPreviewIcon(targetFilePath: string) {
  return __callBackendApi("POST", macro_urlBuilder(`/duck/media/preview`, {
    filePath: targetFilePath
  }))
}