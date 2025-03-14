import { FileUploadDialogOptions, FileUploadType, OpenDialogOptions } from "./types"
import { getUploadDialogFn } from "./stuff"
import { Component } from "solid-js"
import { fileDialog } from "../debug"

type FileUploadComponent = Component<HTMLAttributes<"div">>
type CreateFileUploadOptions<T extends FileUploadType, FinishFn extends AnyFunction> = {
  type$: T
  options$: FileUploadDialogOptions
  onFinish$: FinishFn
  shouldShow$?: () => boolean
}

// @ts-ignore - should work perfectly
export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType.file, (file: string) => any>
): FileUploadComponent
export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType.directory, (directory: string) => any>
): FileUploadComponent
export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType.multiFile, (manyFiles: string[]) => any>
): FileUploadComponent

export function createFileUpload(
  createOptions: CreateFileUploadOptions<FileUploadType, (file: string | string[]) => any>
): FileUploadComponent {
  const { onFinish$, options$, type$, shouldShow$ } = createOptions
  const uploadDialogFn = getUploadDialogFn(type$)

  const onClickThis = async() => {
    const shouldShowDialog = shouldShow$?.() ?? true
    //debug-start
    fileDialog.log(
      "Opening dialog with options\n",
      "| Should show dialog?", shouldShowDialog, "\n",
      "| Dialog options:", options$
    )
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
    const stuff = await uploadDialogFn(options$ as OpenDialogOptions)
    if (stuff === "") {
      //debug-start
      fileDialog.log("Canceled")
      //debug-end
      return
    }
    
    onFinish$(stuff)
  }

  return (props) => <div {...props} onClick={onClickThis} />
}