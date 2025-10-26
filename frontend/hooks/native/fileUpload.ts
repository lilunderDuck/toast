import { createSignal } from "solid-js"
// ...
import { sleep } from "~/utils"
import { OpenDirectoryDialog, OpenFileDialog, OpenMultipleFilesDialog } from "~/wailsjs/go/backend/App"
import type { frontend } from "~/wailsjs/go/models"
// ...
import { 
  type CreateFileUploadOptions,
  type UploadDialog,
} from "./types"

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
  options: CreateFileUploadOptions<T, (file: string) => any>
): UploadDialog<T>
export function createFileUpload<T extends FileUploadType.MULTI_FILE>(
  options: CreateFileUploadOptions<T, (manyFiles: string[]) => any>
): UploadDialog<T>

export function createFileUpload<T extends FileUploadType.FILE>(
  options: CreateFileUploadOptions<FileUploadType, (file: string | string[]) => any>
  //                               ^^^^^^^^^^^^^^
  // Change to T will make typescript angry
): UploadDialog<T> {
  const { onFinish$, type$, dialogOptions$ } = options
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal()
  const [file, setFile] = createSignal()

  const getFileDialogFn = () => {
    switch (type$) {
      case FileUploadType.FILE: return OpenFileDialog
      case FileUploadType.DIRECTORY: return OpenDirectoryDialog
      case FileUploadType.MULTI_FILE: return OpenMultipleFilesDialog
    }
  }

  const onClickThis = async() => {
    if (options.disable$) return

    setIsLoading(true)
    
    try {
      const result = await getFileDialogFn()(dialogOptions$ as frontend.OpenDialogOptions)
      if (result == "" || result.length === 0) {
        console.warn("User canceled the action.")
        setIsLoading(false)
        return
      }

      // @ts-ignore
      setFile(result)
      await onFinish$?.(result)
    } catch (error) {
      console.error(error)
      setError(error)
      sleep(5_000).then(() => setError(undefined))
    }

    setIsLoading(false)
  }

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