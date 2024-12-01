import ListTool from '@editorjs/list'
import CodeTool from '@editorjs/code'
import RawHtmlTool from '@editorjs/raw'
import TableTool from '@editorjs/table'
// ...
import InlineSpoilerTool from 'editorjs-inline-spoiler-tool'

/**A list of basic tool I throw together. That it.
 * @returns 
 */
export function someToolsIShouldNeed() {
  return {
    list: ListTool,
    code: CodeTool,
    html: RawHtmlTool,
    table: TableTool,
    // ... inline tools zone ...
    spoiler: InlineSpoilerTool
  }
}