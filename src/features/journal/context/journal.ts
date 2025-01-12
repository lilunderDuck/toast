import { 
  type Accessor, 
  createSignal, 
  type Setter
} from "solid-js"
// ...
import { type JournalApi } from "~/api/journal"
import { useThisEditorContext } from "~/features/editor"
// ...
import { 
  api_createJournal, 
  api_deleteJournal, 
  api_getAllJournals, 
  api_getJournalContent, 
  api_saveJournalContent, 
  createFolderData, 
  JournalSessionStorage
} from ".."
import { type IFileDisplayContext } from "./fileDisplayContext"
import { JournalEvent } from "./event"

export interface IThisJournalContext {
  /**Accessor for the currently opened journal data. 
   * Returns the currently opened journal data or undefined if none is open.
   */
  $currentlyOpened: Accessor<JournalApi.IJournalData | undefined>
  /**Setter for the currently opened journal data. */
  $setCurrentlyOpened: Setter<JournalApi.IJournalData | undefined>
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

export function createJournal(
  event: JournalEvent,
  thisSessionStorage: JournalSessionStorage,
  fileDisplayContext: IFileDisplayContext
): IThisJournalContext {
  const { $cache, $open } = useThisEditorContext()
  let journalCache = new Map()

  const [$currentlyOpened, $setCurrentlyOpened] = createSignal<JournalApi.IJournalData>()

  const getCurrentJournalGroupId = () => {
    const currentGroupId = thisSessionStorage.$get('currentGroup')?.id
    console.assert(currentGroupId, '[panic] currentGroup data should NOT be null or undefined')

    return currentGroupId
  }

  const stuff: IThisJournalContext = {
    get $cache() {
      return journalCache
    },
    set $cache(value) {
      journalCache = value
    },
    $currentlyOpened, 
    $setCurrentlyOpened,
    async $create(data, type) {
      const currentJournalGroupId = getCurrentJournalGroupId()
      const newData = await api_createJournal(currentJournalGroupId, data, type)
      event.$emit('journal__createJournal', newData)

      journalCache.set(newData.id, newData)
      fileDisplayContext.addToRoot(type === 'journal' ? newData.id : createFolderData(newData!.id))
      return newData
    },
    async $open(journalId) {
      const currentJournalGroupId = getCurrentJournalGroupId()
      let lastContent = $cache.get(journalId)!

      if (!lastContent) {
        lastContent = await api_getJournalContent(currentJournalGroupId, journalId)
      }

      $open({
        id: journalId,
        content: lastContent,
        ...lastContent
      })
    },
    async $delete(journalId) {
      const currentJournalGroupId = getCurrentJournalGroupId()
      await api_deleteJournal(currentJournalGroupId, journalId)
      $setCurrentlyOpened(undefined)
      event.$emit('journal__deleteJournal', journalId)
      $cache.delete(journalId)
    },
    async $getAll() {
      const currentJournalGroupId = getCurrentJournalGroupId()
      return await api_getAllJournals(currentJournalGroupId)
    },
    async $save(journalId, data) {
      const currentJournalGroupId = getCurrentJournalGroupId()
      return await api_saveJournalContent(currentJournalGroupId, journalId, data)
    }
  }

  return stuff
}