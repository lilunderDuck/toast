import ListTool from '@editorjs/list'
import CodeTool from '@editorjs/code'
import RawHtmlTool from '@editorjs/raw'
import TableTool from '@editorjs/table'
import AttachmentTool from '@editorjs/attaches'
import EmbedTool from '@editorjs/embed'
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
    attach: AttachmentTool,
    embed: EmbedTool,
    // ... inline tools zone ...
    spoiler: InlineSpoilerTool,
  }
}