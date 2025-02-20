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
  api_saveJournalContent,
  api_getJournal, 
} from "~/api/journal"
import { useEditorContext } from "~/features/editor"
// ...
import { 
  journalLog,
  JournalSessionStorage
} from ".."
import { type IFileDisplayContext } from "./fileDisplay"

export interface IThisJournalContext extends ReturnType<typeof createJournal> {
  // ...
}

export function createJournal(
  thisSessionStorage: JournalSessionStorage,
  fileDisplayContext: IFileDisplayContext
) {
  const { cache$, open$ } = useEditorContext()

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

    fileDisplayContext.mapping$[newData.id] = newData
    fileDisplayContext.add$(
      type === JournalType.journal ? createFileNodeData(newData.id) : createFolderNodeData(newData!.id),
      'root'
    )

    //debug-start
    journalLog.log('created new journal:', newData)
    //debug-end

    return newData
  }

  /**Opens a journal.
   * @param journalId The ID of the journal to open.
   * @returns A promise that resolves when the journal is opened.
   */
  const open = async(journalId: number) => {
    //debug-start
    journalLog.group("Opening", journalId)
    //debug-end
    const currentJournalGroupId = getCurrentJournalGroupId()
    let journalContent = cache$.get(journalId)!
    let journalData = fileDisplayContext.mapping$[journalId] as IJournalData | undefined
    
    if (!journalData) {
      //debug-start
      journalLog.log("getting the data from the other side...")
      //debug-end
      journalData = await api_getJournal(currentJournalGroupId, journalId)
    }
    
    if (!journalContent) {
      journalContent = journalData.data
    }

    //debug-start
    journalLog.log("journal data is:", journalData)
    //debug-end
    
    setCurrentlyOpened$(journalData)
    
    //debug-start
    journalLog.log("journal should open now")
    //debug-end
    open$({
      id: journalId,
      content: journalContent
    })

    //debug-start
    journalLog.groupEnd()
    //debug-end
  }

  /**Deletes a journal.
   * @param journalId The ID of the journal to delete.
   * @returns A promise that resolves when the journal is deleted.
   */
  const deleteJournal = async(journalId: number) => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    await api_deleteJournal(currentJournalGroupId, journalId)
    setCurrentlyOpened$(undefined)
    cache$.delete(journalId)
    //debug-start
    journalLog.log("deleted:", journalId)
    //debug-end
  }

  /**Saves changes to a journal.
   * @param journalId The ID of the journal to save.
   * @param data The new data for the journal.
   * @returns A promise that resolves to an empty object or null.
   */
  const save = async(journalId: number, data: JournalContentData) => {
    //debug-start
    journalLog.log("saving", journalId)
    //debug-end
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
    open$: open,
    save$: save,
    isLoading$: createSignal(true)
  }
}