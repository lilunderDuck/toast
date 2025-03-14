import type { OpenDirectoryDialog, OpenFileDialog, OpenMultipleFilesDialog } from "~/wailsjs/go/backend/App";

export const enum FileUploadType {
  directory,
  file,
  multiFile
}

export type OpenDirectoryDialogFn = typeof OpenDirectoryDialog
export type OpenFileDialogFn = typeof OpenFileDialog
export type OpenMultiFileDialogFn = typeof OpenMultipleFilesDialog
export type OpenDialogOptions = Parameters<OpenDirectoryDialogFn>[0]
export type FileUploadDialogOptions = Partial<OpenDialogOptions>