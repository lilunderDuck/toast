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
  icon: optional(string()),
})

export const journalCategoryFormSchema = object({
  name: string(),
  icon: optional(string()),
})

/**### namespace `JournalApi`
 * A namespace for *only* types related to the Journal API.
 */
export namespace JournalApi {
  export type Group = InferOutput<typeof journalGroupFormSchema>
  export type Journal = InferOutput<typeof journalFormSchema>
  export type Category = InferOutput<typeof journalCategoryFormSchema>

  export type GroupData = Group & {
    /**The unique identifier of the group. */
    id: string
    /**The creation date of the group. */
    created: Date
    /**The last modification date of the group. */
    modified?: Date
    /**The total number of journals in the group. */
    entries: number
  }

  export type JournalData = Journal & {
    /**The unique identifier of the group. 
     *
     * @note you can create 2 groups with the same name (if you want to confuse you in the future).
     */
    id: string
    /**The creation date of the group. */
    created: Date
    /**The last modification date of the group. */
    modified?: Date
  }

  export type SavedJournalData = JournalData & {
    /**An array of output block data associated with the journal. */
    data?: JournalContentData
  }

  /**The type of the content itself, which is an array of output block data associated with the journal. */
  export type JournalContentData = OutputBlockData[]
}