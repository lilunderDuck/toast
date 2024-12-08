import { 
  type Accessor, 
  createSignal, 
  type Setter, 
  type Signal 
} from "solid-js"
// ...
import { 
  type JournalApi, 
  JOURNAL_CONTENT_ROUTE, 
  JOURNAL_ROUTE, 
} from "~/api/journal"
import { fetchIt, type IEvent } from "~/utils"
import { thisArrayObjects } from "~/common"
import { useThisEditorContext } from "~/features/editor"
// ...
import { useTabContext } from "../components"
import { type JournalEventMap } from "./event"

export interface IThisJournalContext {
  $currentlyOpened: Accessor<JournalApi.JournalData | undefined>
  $setCurrentlyOpened: Setter<JournalApi.JournalData | undefined>
  $currentGroup: Accessor<JournalApi.GroupData | undefined>
  $setCurrentGroup: Setter<JournalApi.GroupData | undefined>
  // ...
  $fileTree: Signal<JournalApi.JournalData[]>
  // ...
  $create(data: JournalApi.Journal): Promise<JournalApi.JournalData>
  $delete(journalId: string): Promise<void>
  $open(journalId: string): Promise<void>
  $getAll(): Promise<JournalApi.JournalData[]>
  $save(journalId: string, data: JournalApi.JournalContentData): Promise<{} | null>
}

export function createJournal(): IThisJournalContext {
  const { $removeTab } = useTabContext()
  const { $cache, $open } = useThisEditorContext()

  const [$currentlyOpened, $setCurrentlyOpened] = createSignal<JournalApi.JournalData>()
  const [$currentGroup, $setCurrentGroup] = createSignal<JournalApi.GroupData>()
  const [fileTree, setFileTree] = createSignal([] as JournalApi.JournalData[])

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
      console.log('[journal] creating', data, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      const newData = await fetchIt<JournalApi.JournalData>('POST', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}`, data)
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
      setFileTree(prev => [...thisArrayObjects(prev).$remove('id', journalId)])
      $setCurrentlyOpened(undefined)
      $removeTab(journalId)
      $cache.delete(journalId)
    },
    async $getAll() {
      const currentJournalGroupId = getCurrentJournalGroupId()
      console.log('[journal] getting all journals data from', currentJournalGroupId, '...')
      return await fetchIt('GET', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}`) as JournalApi.JournalData[]
    },
    async $save(journalId, data) {
      console.log('[journal] saving', journalId, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      return await fetchIt('POST', `${JOURNAL_CONTENT_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`, data)
    }
  }
}