// ...
import EditorJS from '@editorjs/editorjs'

export type OnEditorUpdate = () => {}

export const createEditor = (
  whereToPut: HTMLElement,
  isEditable: boolean,
  onUpdate: AnyFunction
) => {
  console.log('editor created')
  return new EditorJS({
    holder: whereToPut,
    onChange() {
      onUpdate()
    }
  })
}