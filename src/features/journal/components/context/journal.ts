import { 
  type Accessor, 
  createSignal, 
  type Setter
} from "solid-js"
// ...
import { 
  type JournalApi, 
  JOURNAL_CONTENT_ROUTE, 
  JOURNAL_ROUTE, 
} from "~/api/journal"
import { fetchIt } from "~/utils"
import { useThisEditorContext } from "~/features/editor"
// ...
import { createFolder, useTabContext } from "../.."
import { type IFileDisplayContext } from "./fileDisplayContext"

export interface IThisJournalContext {
  /**Accessor for the currently opened journal data. 
   * Returns the currently opened journal data or undefined if none is open.
   */
  $currentlyOpened: Accessor<JournalApi.IJournalData | undefined>
  /**Setter for the currently opened journal data. */
  $setCurrentlyOpened: Setter<JournalApi.IJournalData | undefined>
  /**Accessor for the current journal group data.
   * Returns the current journal group data or undefined if none is selected.
   */
  $currentGroup: Accessor<JournalApi.IGroupData | undefined>
  /**Setter for the current journal group data. */
  $setCurrentGroup: Setter<JournalApi.IGroupData | undefined>
  // ...
  /**Creates a new journal.
   * @param data The initial data for the new journal.
   * @param type The type of the journal file.
   * @returns A promise that resolves to the created journal data.
   */
  $create(data: JournalApi.Journal, type: JournalApi.FileType): Promise<JournalApi.IJournalData>
  /**Deletes a journal.
   * @param journalId The ID of the journal to delete.
   * @returns A promise that resolves when the journal is deleted.
   */
  $delete(journalId: string): Promise<void>
  /**Opens a journal.
   * @param journalId The ID of the journal to open.
   * @returns A promise that resolves when the journal is opened.
   */
  $open(journalId: string): Promise<void>
  /**Gets all journals.
   * @returns A promise that resolves to an array of journal data.
   */
  $getAll(): Promise<JournalApi.IJournalData[]>
  /**Saves changes to a journal.
   * @param journalId The ID of the journal to save.
   * @param data The new data for the journal.
   * @returns A promise that resolves to an empty object or null.
   */
  $save(journalId: string, data: JournalApi.JournalContentData): Promise<{} | null>
  $cache: Map<string, JournalApi.IJournalData | JournalApi.ICategoryData>
}

export function createJournal(fileDisplayContext: IFileDisplayContext): IThisJournalContext {
  const { $removeTab } = useTabContext()
  const { $cache, $open } = useThisEditorContext()
  let journalCache = new Map()

  const [$currentlyOpened, $setCurrentlyOpened] = createSignal<JournalApi.IJournalData>()
  const [$currentGroup, $setCurrentGroup] = createSignal<JournalApi.IGroupData>()

  const getCurrentJournalGroupId = () => {
    console.assert($currentGroup(), '[panic] currentGroup data should NOT be null or undefined')

    return $currentGroup()?.id!
  }

  return {
    get $cache() {
      return journalCache
    },
    set $cache(value) {
      journalCache = value
      console.log(value)
    },
    $currentlyOpened, 
    $setCurrentlyOpened,
    $currentGroup, 
    $setCurrentGroup,
    async $create(data, type) {
      console.log('[journal] creating', data, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      const route = `${JOURNAL_ROUTE}?id=${currentJournalGroupId}&type=${type}`
      const newData = await fetchIt<JournalApi.IJournalData>('POST', route, data)

      console.log('[journal] updating cache and file display')
      journalCache.set(newData!.id, newData)
      fileDisplayContext.add(
        type === 'journal' ? newData!.id : createFolder(newData!.id),
        'root'
      )
      return newData!
    },
    async $open(journalId) {
      console.log('[journal] opening', journalId, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      let lastContent = $cache.get(journalId)!

      if (!lastContent) {
        console.group()
        lastContent = await fetchIt('GET', `${JOURNAL_CONTENT_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`) as JournalApi.JournalContentData
        console.groupEnd()
      }

      $open({
        id: journalId,
        content: lastContent,
        ...lastContent
      })
    },
    async $delete(journalId) {
      console.log('[journal] deleting', journalId, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      await fetchIt('DELETE', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`)
      $setCurrentlyOpened(undefined)
      $removeTab(journalId)
      $cache.delete(journalId)
    },
    async $getAll() {
      const currentJournalGroupId = getCurrentJournalGroupId()
      console.log('[journal] getting all journals data from', currentJournalGroupId, '...')
      return await fetchIt('GET', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}`) as JournalApi.IJournalData[]
    },
    async $save(journalId, data) {
      console.log('[journal] saving', journalId, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      return await fetchIt('POST', `${JOURNAL_CONTENT_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`, data)
    }
  }
}