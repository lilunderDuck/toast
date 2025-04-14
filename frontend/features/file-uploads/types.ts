import { Component } from "solid-js";
import { FileDialogFilter } from "~/api/misc";
// import type { OpenDirectoryDialog, OpenFileDialog, OpenMultipleFilesDialog } from "~/wailsjs/go/backend/App";

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
  title$: string
  filter$?: () => FileDialogFilter[]
  /**Fired when the file upload is complete.
   * 
   * It receives 
   * - the selected file if you set the type to `FileUploadType.file`
   * - the selected directory if you set the type to `FileUploadType.directory`
   * - a list of selected file if you set the type to `FileUploadType.multiFile`
   */
  onFinish$: FinishFn
  /**Whether the upload dialog should be shown.
   * 
   * If it returns false, the dialog won't open.
   * @default () => true
   */
  shouldShow$?: () => boolean
}