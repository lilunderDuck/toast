import EditorJS from '@editorjs/editorjs'
// ...
import { 
  createColorPicker, 
  HtmlBlock,
  CodeBlock,
  LinkBlock
} from '../tools'
// ...
// before you yell at me,
// for some reason, those import with the "// @ts-ignore" doesn't have any type at all.
// so just assume that it does works, okay?
// ... until maybe me in the future starts to confuse myself I think.
// now you can yell at me

import ListTool from '@editorjs/list'
// @ts-ignore
import RawHtmlTool from '@editorjs/raw'
// @ts-ignore
import AttachmentTool from '@editorjs/attaches'
import EmbedTool from '@editorjs/embed'
import TableTool from '@editorjs/table'

// ... inline tools ...
// @ts-ignore
import InlineSpoilerTool from 'editorjs-inline-spoiler-tool'
import UnderlineTool from '@editorjs/underline'
// @ts-ignore
import MarkerTool from '@editorjs/marker'

// override editor's default styles
import './createEditor.css'

export function createEditor(whereToPut: HTMLElement, isEditable: boolean, onUpdate: AnyFunction) {
  const tools = {
    // ... block zone ...
    // all of the number here is the block type, to easily confuse myself
    list: ListTool,
    attach: AttachmentTool,
    // @ts-ignore - long and confusing type error, just gonna ignore that for now
    embed: EmbedTool,
    table: TableTool,
    html: HtmlBlock,
    code: CodeBlock,
    link: LinkBlock,
    // ... inline tools zone ...
    spoiler: InlineSpoilerTool,
    underline: UnderlineTool,
    marker: MarkerTool,
    colorPicker: createColorPicker()
  }

  return new EditorJS({
    holder: whereToPut,
    autofocus: true,
    readOnly: isEditable,
    // @ts-ignore - does work.
    tools,
    onReady() {
      console.log('[editor] editor created')
    },
    onChange() {
      onUpdate()
    }
  })
}