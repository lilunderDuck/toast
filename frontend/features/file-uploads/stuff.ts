import { 
  OpenDirectoryDialog, 
  OpenFileDialog, 
  OpenMultipleFilesDialog 
} from "~/wailsjs/go/backend/App"
import {
  FileUploadType, 
  type OpenDirectoryDialogFn, 
  type OpenFileDialogFn, 
  type OpenMultiFileDialogFn 
} from "./types"

interface DialogFnMapping {
  [FileUploadType.directory]: OpenDirectoryDialogFn
  [FileUploadType.file]: OpenFileDialogFn
  [FileUploadType.multiFile]: OpenMultiFileDialogFn
}

export function getUploadDialogFn<T extends FileUploadType>(type: T) {
  switch (type) {
    case FileUploadType.directory:
      return OpenDirectoryDialog as DialogFnMapping[T]
    case FileUploadType.file:
      return OpenFileDialog as DialogFnMapping[T]
    case FileUploadType.multiFile:
      return OpenMultipleFilesDialog as DialogFnMapping[T]
    //debug-start
    default:
      throw new Error(`[file upload] case ${type} hasn't been handled yet`)
    //debug-end
  }
}