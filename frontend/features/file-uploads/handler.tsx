import { 
  type CreateFileUploadOptions,
  type FileUploadStuff,
  FileUploadType, 
} from "./types"
import { fileDialog } from "../debug"
import { api_openFileDialog } from "~/api/misc"
import { createSignal } from "solid-js"

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

  const onClickThis = async() => {
    if (isLoading()) {
      //debug-start
      fileDialog.log("Dialog won't be opened. Another one is already showing to you.")
      //debug-end
      return
    }
    const shouldShowDialog = shouldShow$?.() ?? true
    //debug-start
    fileDialog.log("Opening dialog with options:", createOptions)
    //debug-end
    if (!shouldShowDialog) {
      //debug-start
      fileDialog.log("Dialog won't be opened.")
      //debug-end
      return
    }
    
    //debug-start
    fileDialog.log("Opening dialog now...")
    //debug-end

    setIsLoading(true)
    const result = await api_openFileDialog({
      title: title$,
      filters: filter$ ? filter$() : undefined
    })

    if (!result?.result || result?.result === "") {
      //debug-start
      fileDialog.log("Canceled")
      //debug-end
      setIsLoading(false)
      return
    }

    await onFinish$(result.result)
    setIsLoading(false)
  }

  return {
    FileUploadZone$(props) {
      return <div {...props} onClick={onClickThis} />
    },
    isUploading$: isLoading
  }
}