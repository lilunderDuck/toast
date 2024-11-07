import { JSONContent } from "@tiptap/core"

export type EditorData = {
  id: string
  content: JSONContent
}

export type OnEditorSwitchingEvent =  (previous: EditorData | null, current: EditorData) => any
export type OnEditorUpdateEvent = (data: EditorData) => any