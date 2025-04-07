import { Component } from "solid-js";
// import type { OpenDirectoryDialog, OpenFileDialog, OpenMultipleFilesDialog } from "~/wailsjs/go/backend/App";

export const enum FileUploadType {
  directory,
  file,
  multiFile
}

export type OpenDirectoryDialogFn = AnyFunction
export type OpenFileDialogFn = AnyFunction
export type OpenMultiFileDialogFn = AnyFunction
export type OpenDialogOptions = Parameters<OpenDirectoryDialogFn>[0]
export type FileUploadDialogOptions = Partial<OpenDialogOptions>

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
  /**Provides options for the file upload dialog.
   * @note The reason why all of {@link FileUploadDialogOptions} properties are all in `PascalCase`
   * is because this type is coming from auto-generated type from the backend, which `wails` 
   * handles all of that stuff.
   * 
   * I could just copy all of the types into here and rewrite it to `camelCase`, but
   * I'm too lazy man.
   * 
   * @see https://wails.io/docs/reference/runtime/dialog/ for a full list of options
   */
  options$: FileUploadDialogOptions
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