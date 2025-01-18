import type { JournalCategorySchema, JournalSchema, JournalGroupSchema } from "./validate"
import { OutputBlockData } from "@editorjs/editorjs"
import { apiRoute } from "~/common"
import { JournalFileType, JournalVituralFileTree } from "./vituralFileTree"

export const JOURNAL_ROUTE = apiRoute('/journal/stuff')
export const JOURNAL_GROUP_ROUTE = apiRoute('/journal/group')

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
  type: JournalFileType.category
}

/**The journal meta data. This does not contain the actural journal content.
 * @see {@link IJournalData}
 */
export interface IJournalMetadata extends JournalSchema, UniqueId, CreatedAndModifiedDate {
  type: JournalFileType.journal
}

/**The type of the content itself, which is an array of output block data associated with the journal. */
export type JournalContentData = OutputBlockData[]

export interface IJournalData extends IJournalMetadata {
  /**An array of output block data associated with the journal. */
  data?: JournalContentData
}