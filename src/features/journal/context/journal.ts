import { 
  Journal, 
  JOURNAL_AUTO_SAVE_ROUTE, 
  JOURNAL_CONTENT_ROUTE, 
  JOURNAL_ROUTE, 
  JournalData,   
  JournalGroupData 
} from "~/api"
import { fetchIt } from "~/utils"
import { Accessor, createSignal, Setter, Signal } from "solid-js"
import type { OutputData } from "@editorjs/editorjs"
import { thisArrayObjects } from "~/common"

export interface IThisJournalContext {
  $currentlyOpened: Accessor<JournalData | undefined>
  $setCurrentlyOpened: Setter<JournalData | undefined>
  $currentGroup: Accessor<JournalGroupData | undefined>
  $setCurrentGroup: Setter<JournalGroupData | undefined>
  // ...
  $fileTree: Signal<JournalData[]>
  // ...
  $create(data: Journal): Promise<JournalData>
  $delete(journalId: string): Promise<void>
  $getAll(): Promise<JournalData[]>
  $save(journalId: string, data: OutputData): Promise<{} | null>
}

export function createJournal(): IThisJournalContext {
  const [$currentlyOpened, $setCurrentlyOpened] = createSignal<JournalData>()
  const [$currentGroup, $setCurrentGroup] = createSignal<JournalGroupData>()
  const [fileTree, setFileTree] = createSignal([] as JournalData[])

  const getCurrentJournalGroupId = () => {
    console.assert($currentGroup(), '[panic] currentGroup data should NOT be null or undefined')

    return $currentGroup()?.id!
  }

  return {
    $currentlyOpened, 
    $setCurrentlyOpened,
    $currentGroup, 
    $setCurrentGroup,
    $fileTree: [fileTree, setFileTree],
    async $create(data) {
      const currentJournalGroupId = getCurrentJournalGroupId()
      return (await fetchIt<JournalData>('POST', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}`, data))!
    },
    async $delete(journalId) {
      const currentJournalGroupId = getCurrentJournalGroupId()
      await fetchIt('DELETE', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`)
      setFileTree(prev => [...thisArrayObjects(prev).$remove('id', journalId)])
      $setCurrentlyOpened(undefined)
    },
    async $getAll() {
      const currentJournalGroupId = getCurrentJournalGroupId()
      return await fetchIt<JournalData[]>('GET', `${JOURNAL_CONTENT_ROUTE}?id=${currentJournalGroupId}`) ?? []
    },
    async $save(journalId, data) {
      const currentJournalGroupId = getCurrentJournalGroupId()
      return await fetchIt('POST', `${JOURNAL_AUTO_SAVE_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`, data)
    }
  }
}