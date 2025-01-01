import { InferOutput } from "valibot"
import type { journalCategoryFormSchema, journalFormSchema, journalGroupFormSchema } from "./validate"
import { OutputBlockData } from "@editorjs/editorjs"
import { apiRoute } from "~/common"

export const JOURNAL_ROUTE = apiRoute('/journal')
export const JOURNAL_GROUP_ROUTE = apiRoute('/journal-group')
export const JOURNAL_CONTENT_ROUTE = apiRoute('/journal-content')

/**### namespace `JournalApi`
 * A namespace for *only* types related to the Journal API.
 */
export namespace JournalApi {
  export type Group = InferOutput<typeof journalGroupFormSchema>
  export type Journal = InferOutput<typeof journalFormSchema>
  export type Category = InferOutput<typeof journalCategoryFormSchema>

  export type UniqueId = {
    id: string
  }

  export type CreationAndModifiedDate = {
    created: Date
    modified?: Date
  }

  export type GroupTree = string | {
    id: string
    child: GroupTree[]
  }

  export interface IGroupData extends Group, UniqueId, CreationAndModifiedDate {
    tree: GroupTree[]
    entries: number
  }

  export interface IFetchedGroupData extends IGroupData {
    treeData: Record<string, IJournalData | ICategoryData>
  }

  /**The journal meta data. This does not contain the actural journal content.
   * @see {@link SavedJournalData}
   */
  export interface IJournalData extends Journal, UniqueId, CreationAndModifiedDate {
    // ...
  }
  
  /**The saved journal data that will be stored to the disk */
  export type SavedJournalData = IJournalData & {
    /**An array of output block data associated with the journal. */
    data?: JournalContentData
  }

  export interface ICategoryData extends Category, UniqueId, CreationAndModifiedDate {
    // ...
  }

  /**The type of the content itself, which is an array of output block data associated with the journal. */
  export type JournalContentData = OutputBlockData[]

  /**A list of files that can be stored */
  export type Files = SavedJournalData | ICategoryData

  export type FileType = 'journal' | 'category'
}