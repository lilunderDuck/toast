import { Accessor, Component } from "solid-js"
import type { frontend } from "~/wailsjs/go/models";

export const enum FileUploadType {
  directory,
  file,
  multiFile
}

/**Component type that represents a file upload click zone.
 * 
 * It's a simple div that, when clicked, shows a file upload dialog.
 */
export type FileUploadComponent = Component<HTMLAttributes<"div">>

export type UploadDialog = {
  isUploading$: Accessor<boolean>
  error$: Accessor<any> // missing type
  open$(): Promise<void>
}

/**Options for creating a file upload component.
 *
 * @template T The type of file upload, see {@link FileUploadType}
 * @template FinishFn The type of the function called when the upload finishes.
 */
export type CreateFileUploadOptions<T extends FileUploadType, FinishFn extends AnyFunction> = {
  /**The type of file upload.
   * @see {@link FileUploadType} for a full list of options.
   */
  type$: T
  dialogOptions$?: Partial<frontend.OpenDialogOptions>
  /**Fired when the file upload is complete.
   * 
   * It receives 
   * - the selected file if you set the type to `FileUploadType.file`
   * - the selected directory if you set the type to `FileUploadType.directory`
   * - a list of selected file if you set the type to `FileUploadType.multiFile`
   */
  onFinish$: FinishFn
  disable$?: boolean
}