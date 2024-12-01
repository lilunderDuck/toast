import EditorJS from '@editorjs/editorjs'
// ...
import { createColorPicker, someToolsIShouldNeed } from '../tools'

export type OnEditorUpdate = () => {}

export const createEditor = (
  whereToPut: HTMLElement,
  isEditable: boolean,
  onUpdate: AnyFunction
) => {
  return new EditorJS({
    holder: whereToPut,
    autofocus: true,
    tools: {
      ...someToolsIShouldNeed(),
      colorPicker: createColorPicker()
    },
    onReady() {
      console.log('[editor] editor created')
    },
    onChange() {
      onUpdate()
    }
  })
}