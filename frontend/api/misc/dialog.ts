import { __callBackendApi } from "../call"

export type FileDialogFilter = {
  name: string
  extension: string
}

export type FileDialogOptions = {
  title: string
  filters?: FileDialogFilter[]
}

export type FileDialogResult = {
  result: string
}

export async function api_openFileDialog(options: FileDialogOptions): Promise<FileDialogResult> {
  return await __callBackendApi("POST", "/native/openFileDialog", options)
}