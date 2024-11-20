// ...
import "./editor.css"
import EditorJS from '@editorjs/editorjs'

export type OnEditorUpdate = () => {}

export const createEditor = (
  whereToPut: HTMLElement,
  isEditable: boolean,
  onUpdate: OnEditorUpdate
) => {
  console.log('editor created')
  return new EditorJS({
    holder: whereToPut,
  })
}