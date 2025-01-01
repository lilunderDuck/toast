/**[`@editorjs/attaches`](https://github.com/editor-js/attaches) configuration options 
 * @see https://github.com/editor-js/attaches#config-params
 */
export interface IEditorJsAttachesOptions {
  /**Optional endpoint for file uploading or use uploader */
  endpoint: string
  /**Optional custom uploading method or use endpoint */
  uploader:	{
    uploadByFile: Function
  }

  /**Name of uploaded file field in `POST` request 
   * @default 'file'
   */
  field?: string
  /**Mime-types of files that can be accepted with file selection.
   * @default '*'
   */
  types?: string 
  /**Placeholder for file upload button
   * @default 'Select file'
   */
  buttonText?:	string
  /**Message to show if file upload failed
   * @default 'File upload failed'
   */
  errorMessage?:	string
  /**Object with any custom headers which will be added to request. Example: `{"X-CSRF-TOKEN": "W5fe2...hR8d1"}`
   * @default {}
   */
  additionalRequestHeaders?:	object
}