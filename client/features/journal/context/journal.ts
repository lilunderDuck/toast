import { 
  createSignal, 
} from "solid-js"
// ...
import { 
  createFileNodeData,
  createFolderNodeData,
  type IJournalData, 
  type JournalContentData, 
  JournalType, 
  type JournalSchema,
  api_createJournal, 
  api_deleteJournal, 
  api_getAllJournals, 
  api_saveJournalContent,
  api_getJournal, 
} from "~/api/journal"
import { useThisEditorContext } from "~/features/editor"
// ...
import { 
  JournalSessionStorage
} from ".."
import { type IFileDisplayContext } from "./fileDisplay"
import { JournalEvent } from "./event"

export interface IThisJournalContext extends ReturnType<typeof createJournal> {
  // ...
}

export function createJournal(
  event: JournalEvent,
  thisSessionStorage: JournalSessionStorage,
  fileDisplayContext: IFileDisplayContext
) {
  const { cache$, open$ } = useThisEditorContext()

  const [currentlyOpened$, setCurrentlyOpened$] = createSignal<IJournalData>()

  const getCurrentJournalGroupId = () => {
    const currentGroupId = thisSessionStorage.get$('currentGroup')?.id
    console.assert(currentGroupId, '[panic] currentGroup data should NOT be null or undefined')

    return currentGroupId
  }

  /**Creates a new journal.
   * @param data The initial data for the new journal.
   * @param type The type of the journal file.
   * @returns A promise that resolves to the created journal data.
   */
  const create = async(data: JournalSchema, type: JournalType): Promise<IJournalData> => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    const newData = await api_createJournal(currentJournalGroupId, data, type)
    event.emit$('journal__createJournal', newData)

    fileDisplayContext.mapping$[newData.id] = newData
    fileDisplayContext.add$(
      type === JournalType.journal ? createFileNodeData(newData.id) : createFolderNodeData(newData!.id),
      'root'
    )
    return newData
  }

  /**Opens a journal.
   * @param journalId The ID of the journal to open.
   * @returns A promise that resolves when the journal is opened.
   */
  const open = async(journalId: number) => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    let lastContent = cache$.get(journalId)!
    let journalData = fileDisplayContext.mapping$[journalId] as IJournalData | undefined
    if (!journalData) {
      journalData = await api_getJournal(currentJournalGroupId, journalId)
    }

    if (!lastContent) {
      lastContent = journalData.data
    }

    console.log(lastContent)
    setCurrentlyOpened$(journalData)

    open$({
      id: `${journalId}`,
      content: lastContent,
      ...lastContent
    })
  }

  /**Deletes a journal.
   * @param journalId The ID of the journal to delete.
   * @returns A promise that resolves when the journal is deleted.
   */
  const deleteJournal = async(journalId: number) => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    await api_deleteJournal(currentJournalGroupId, journalId)
    setCurrentlyOpened$(undefined)
    event.emit$('journal__deleteJournal', journalId)
    cache$.delete(journalId)
  }

  /**Gets all journals.
   * @returns A promise that resolves to an array of journal data.
   */
  const getAll = async() => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    return await api_getAllJournals(currentJournalGroupId)
  }

  /**Saves changes to a journal.
   * @param journalId The ID of the journal to save.
   * @param data The new data for the journal.
   * @returns A promise that resolves to an empty object or null.
   */
  const save = async(journalId: number, data: JournalContentData) => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    return await api_saveJournalContent(currentJournalGroupId, journalId, data)
  }

  return {
    /**Accessor for the currently opened journal data. 
     * Returns the currently opened journal data or undefined if none is open.
     */
    currentlyOpened$, 
    /**Setter for the currently opened journal data. */
    setCurrentlyOpened$,
    create$: create,
    delete$: deleteJournal,
    getAll$: getAll,
    open$: open,
    save$: save
  }
}