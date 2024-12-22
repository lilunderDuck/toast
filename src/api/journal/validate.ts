import { OutputBlockData } from '@editorjs/editorjs'

import {
  object,
  optional,
  string,
  type InferOutput
} from 'valibot'

export const journalGroupFormSchema = object({
  name: string(),
  description: optional(string()),
  icon: optional(string()),
})

export const journalFormSchema = object({
  name: string(),
})

export const journalCategoryFormSchema = object({
  name: string(),
})

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

  export interface IGroupTree {
    [journalId: string]: 0 | this
  }

  export interface IGroupData extends Group, UniqueId, CreationAndModifiedDate {
    tree: IGroupTree
    entries: number
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