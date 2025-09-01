import type { Accessor } from "solid-js"
// ...
import type { frontend } from "~/wailsjs/go/models"

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
   * - the selected file if you set the type to `FileUploadType.FILE`
   * - the selected directory if you set the type to `FileUploadType.DIRECTORY`
   * - a list of selected file if you set the type to `FileUploadType.MULTI_FILE`
   */
  onFinish$: FinishFn
  disable$?: boolean
}