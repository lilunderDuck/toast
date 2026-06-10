import { createSignal, onCleanup } from "solid-js"
// ...
import { sleep } from "~/utils"
import { OpenDirectoryDialog, OpenFileDialog, OpenMultipleFilesDialog } from "~/wailsjs/go/backend/App"
import type { frontend } from "~/wailsjs/go/models"
// ...
import { 
  type CreateFileUploadOptions,
  type UploadDialog,
} from "./types"
import { DEBUG_ERR_LABEL, DEBUG_INFO_LABEL, DEBUG_WARN_LABEL } from "macro-def"

/**Creates a file upload component based on the provided options.
 *
 * @param options options for creating the file upload component.
 * 
 * @see {@link UploadDialog}
 * @see {@link CreateFileUploadOptions}
 * @see {@link FileUploadType}
*/
// @ts-ignore - should work perfectly
export function createFileUpload<T extends FileUploadType.FILE>(
  options: CreateFileUploadOptions<T, (file: string) => any>
): UploadDialog<T>
export function createFileUpload<T extends FileUploadType.DIRECTORY>(
  options: CreateFileUploadOptions<T, (directory: string) => any>
): UploadDialog<T>
export function createFileUpload<T extends FileUploadType.MULTI_FILE>(
  options: CreateFileUploadOptions<T, (manyFiles: string[]) => any>
): UploadDialog<T>

export function createFileUpload<T extends FileUploadType>(
  options: CreateFileUploadOptions<FileUploadType, (file: string | string[]) => any>
  //                               ^^^^^^^^^^^^^^
  // Change to T will make typescript angry
): UploadDialog<T> {
  const { onFinish$, type$, dialogOptions$ } = options
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal()
  const [file, setFile] = createSignal()

  onCleanup(() => {
    DEBUG_INFO_LABEL("file upload", "cleaning up...")
    setFile(undefined)
  })

  const getFileDialogFn = () => {
    switch (type$) {
      case FileUploadType.FILE: return OpenFileDialog
      case FileUploadType.DIRECTORY: return OpenDirectoryDialog
      case FileUploadType.MULTI_FILE: return OpenMultipleFilesDialog
    }
  }

  const onClickThis = async() => {
    if (options.disabled$?.()) {
      DEBUG_WARN_LABEL("file upload", "refused to open, file upload is disabled.")
      return
    }

    DEBUG_INFO_LABEL("file upload", "opening file dialog...")

    setIsLoading(true)
    
    try {
      const result = await getFileDialogFn()(dialogOptions$ as frontend.OpenDialogOptions)
      if (result == "" || result.length === 0) {
        DEBUG_WARN_LABEL("file upload", "user canceled the action.")
        setIsLoading(false)
        return
      }

      // @ts-ignore
      setFile(result)
      await onFinish$?.(result)
    } catch (error) {
      DEBUG_ERR_LABEL("file upload", error)
      setError(error)
      sleep(5_000).then(() => setError(undefined))
    }

    setIsLoading(false)
  }

  DEBUG_INFO_LABEL("file upload", "created with options:", options)

  return {
    // @ts-ignore
    setFilePath$: setFile,
    open$: onClickThis,
    isUploading$: isLoading,
    error$: error,
    // @ts-ignore
    file$: file
  }
}