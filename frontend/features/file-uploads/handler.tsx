import { 
  type CreateFileUploadOptions,
  type FileUploadStuff,
  FileUploadType, 
} from "./types"
import { fileDialog } from "../debug"
import { api_openFileDialog } from "~/api/misc"
import { createSignal } from "solid-js"
import { sleep } from "~/utils"

/**Creates a file upload component based on the provided options.
 *
 * @param createOptions options for creating the file upload component.
 * @returns A {@link FileUploadStuff} that, when clicked, triggers the file upload dialog.
 * 
 * @see {@link FileUploadStuff}
 * @see {@link CreateFileUploadOptions}
 * @see {@link FileUploadType}
*/
// @ts-ignore - should work perfectly
export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType.file, (file: string) => any>
): FileUploadStuff
export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType.multiFile, (manyFiles: string[]) => any>
): FileUploadStuff

export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType, (file: string | string[]) => any>
): FileUploadStuff {
  const { onFinish$, shouldShow$, filter$, title$ } = createOptions
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal()

  const onClickThis = async() => {
    if (isLoading()) {
      isDevMode && fileDialog.log("Dialog won't be opened. Another one is already showing to you.")
      return
    }

    const shouldShowDialog = shouldShow$?.() ?? true
    isDevMode && fileDialog.log("Opening dialog with options:", createOptions)
    
    if (!shouldShowDialog) {
      isDevMode && fileDialog.log("Dialog won't be opened.")
      return
    }
    
    isDevMode && fileDialog.log("Opening dialog now...")

    setIsLoading(true)
    const result = await api_openFileDialog({
      title: title$,
      filters: filter$ ? filter$() : undefined
    })

    if (!result?.result || result?.result === "") {
      isDevMode && fileDialog.log("Canceled")
      setIsLoading(false)
      return
    }

    try {
      await onFinish$(result.result)
    } catch (error) {
      setError(error)
      sleep(5_000).then(() => setError(undefined))
    }
    setIsLoading(false)
  }

  return {
    FileUploadZone$(props) {
      return isDevMode ? (
        // add a attribute so I can find which one is a file upload div.
        <div {...props} onClick={onClickThis} data-debug="file upload" />
      ) : (
        <div {...props} onClick={onClickThis} />
      )
    },
    isUploading$: isLoading,
    error$: error
  }
}