import { IEvent } from "~/utils"
import { EditorDocumentData } from "."

export type EditorEventMap = {
  /**Fired when the editor is about to switch to another document. */
  editor__onSwitching$: (
    /**The previous editor data before being wiped out */
    previousData?: EditorDocumentData
  ) => any
  /**Fired when the editor is updating its blocks data. */
  editor__onUpdate$: (
    /**The new editor data */
    data: EditorDocumentData
  ) => any
}

export type EditorEvent = IEvent<EditorEventMap>