import { IEvent } from "~/utils"
import { EditorDocumentData } from "."

export type EditorEventMap = {
  editor__onSwitching: (previousData?: EditorDocumentData) => any
  editor__onUpdate: (data: EditorDocumentData) => any
}

export type EditorEvent = IEvent<EditorEventMap>