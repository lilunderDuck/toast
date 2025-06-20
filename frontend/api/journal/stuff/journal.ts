import type { CreatedAndModifiedDate, UniqueId } from "./commonTypes"
import { EditorData } from "~/features/editor"

export const enum JournalType {
  journal,
  category
}

export type JournalCategorySchema = {
  name: string
}

export type JournalSchema = {
  name: string
}

export interface IJournalCategoryData extends JournalCategorySchema, UniqueId, CreatedAndModifiedDate {
  // ...
}

/**The type of the content itself, which is an array of output block data associated with the journal. */
export type JournalContentData = EditorData["content"]

export interface IJournalData extends JournalSchema, UniqueId, CreatedAndModifiedDate {
  /**An array of output block data associated with the journal. */
  data: JournalContentData
}