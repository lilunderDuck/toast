import { InferOutput } from "valibot"
import type { journalCategoryFormSchema, journalFormSchema, journalGroupFormSchema } from "./validate"
import { OutputBlockData } from "@editorjs/editorjs"
import { apiRoute } from "~/common"
import { JournalVituralFileTree } from "./vituralFileTree"

export const JOURNAL_ROUTE = apiRoute('/journal/stuff')
export const JOURNAL_GROUP_ROUTE = apiRoute('/journal/group')

export type JournalGroupSchema = InferOutput<typeof journalGroupFormSchema>
export type JournalCategorySchema = InferOutput<typeof journalCategoryFormSchema>
export type JournalSchema = InferOutput<typeof journalFormSchema>

type UniqueId = {
  id: string
}

type CreatedAndModifiedDate = {
  created: Date
  modified?: Date
}

export interface IJournalGroupData extends JournalGroupSchema, UniqueId, CreatedAndModifiedDate {
  tree: JournalVituralFileTree.Tree[]
  entries: number
}

export interface IJournalCategoryData extends JournalCategorySchema, UniqueId, CreatedAndModifiedDate {
  // ...
}

/**The journal meta data. This does not contain the actural journal content.
 * @see {@link SavedJournalData}
 */
export interface IJournalMetadata extends JournalSchema, UniqueId, CreatedAndModifiedDate {
  // ...
}

/**The type of the content itself, which is an array of output block data associated with the journal. */
export type JournalContentData = OutputBlockData[]

export interface IJournalData extends IJournalMetadata {
  /**An array of output block data associated with the journal. */
  data?: JournalContentData
}