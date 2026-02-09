import type { JSONContent } from "@tiptap/core"
import type { IEvent } from "~/utils"

export type EditorGenericIdAttribute = {
  id: string
}

export type EditorData = {
  /**The unique identifier for the current editor's content. */
  id: string
  /**The content of the editor. */
  content: JSONContent
}

export type EditorEventMap = IEvent<{
  /**Fired when the editor is switching to a new document. 
   * @param oldData The data of the document before being replaced.
   */
  [EditorEvent.ON_SWITCHING]: (oldData: EditorData) => any
  /**Fired when the editor's content is updated. 
   * @param data The updated editor data.
   */
  [EditorEvent.ON_UPDATE]: (data: EditorData) => any
  [EditorEvent.UPDATE_BONGO_CAT_ANIMATION]: AnyNoArgsFunction
}>