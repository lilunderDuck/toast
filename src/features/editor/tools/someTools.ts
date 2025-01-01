// before you yell at me,
// for some reason, those import with the "// @ts-ignore" doesn't have any type at all.
// so just assume that it does works, okay?
// ... until maybe me in the future starts to confuse myself I think.
// now you can yell at me

import ListTool from '@editorjs/list'
import CodeTool from '@editorjs/code'
// @ts-ignore
import RawHtmlTool from '@editorjs/raw'
import TableTool from '@editorjs/table'
// @ts-ignore
import AttachmentTool from '@editorjs/attaches'
import EmbedTool from '@editorjs/embed'
// ...
// @ts-ignore
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