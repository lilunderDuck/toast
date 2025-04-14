import { 
  type CreateFileUploadOptions,
  type FileUploadComponent,
  FileUploadType, 
} from "./types"
import { fileDialog } from "../debug"
import { api_openFileDialog } from "~/api/misc"

/**Creates a file upload component based on the provided options.
 *
 * @param createOptions options for creating the file upload component.
 * @returns A {@link FileUploadComponent} that, when clicked, triggers the file upload dialog.
 * 
 * @see {@link FileUploadComponent}
 * @see {@link CreateFileUploadOptions}
 * @see {@link FileUploadType}
*/
// @ts-ignore - should work perfectly
export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType.file, (file: string) => any>
): FileUploadComponent
export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType.multiFile, (manyFiles: string[]) => any>
): FileUploadComponent

export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType, (file: string | string[]) => any>
): FileUploadComponent {
  const { onFinish$, shouldShow$, filter$, title$ } = createOptions
  let isLocked = false

  const onClickThis = async() => {
    if (isLocked) {
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

    isLocked = true
    const result = await api_openFileDialog({
      title: title$,
      filters: filter$ ? filter$() : undefined
    })

    if (!result?.result || result?.result === "") {
      //debug-start
      fileDialog.log("Canceled")
      //debug-end
      isLocked = false
      return
    }

    onFinish$(result.result)
    isLocked = false
  }

  return (props) => <div {...props} onClick={onClickThis} />
}