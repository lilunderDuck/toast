import { createSignal } from "solid-js"
// ...
import { sleep } from "~/utils"
import { OpenDirectoryDialog, OpenFileDialog, OpenMultipleFilesDialog } from "~/wailsjs/go/backend/App"
import type { frontend } from "~/wailsjs/go/models"
// ...
import { 
  type CreateFileUploadOptions,
  type UploadDialog,
  FileUploadType, 
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
export function createFileUpload(
  options: CreateFileUploadOptions<FileUploadType.file, (file: string) => any>
): UploadDialog
export function createFileUpload(
  options: CreateFileUploadOptions<FileUploadType.directory, (file: string) => any>
): UploadDialog
export function createFileUpload(
  options: CreateFileUploadOptions<FileUploadType.multiFile, (manyFiles: string[]) => any>
): UploadDialog

export function createFileUpload(
  options: CreateFileUploadOptions<FileUploadType, (file: string | string[]) => any>
): UploadDialog {
  const { onFinish$, type$, dialogOptions$ } = options
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal()

  const getFileDialogFn = () => {
    switch (type$) {
      case FileUploadType.file: return OpenFileDialog
      case FileUploadType.directory: return OpenDirectoryDialog
      case FileUploadType.multiFile: return OpenMultipleFilesDialog
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

      await onFinish$(result)
    } catch (error) {
      console.error(error)
      setError(error)
      sleep(5_000).then(() => setError(undefined))
    }

    setIsLoading(false)
  }

  return {
    FileUploadZone$(props) {
      return <div {...props} onClick={onClickThis} />
    },
    isUploading$: isLoading,
    error$: error
  }
}