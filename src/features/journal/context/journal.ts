import { 
  Journal, 
  JOURNAL_AUTO_SAVE_ROUTE, 
  JOURNAL_CONTENT_ROUTE, 
  JOURNAL_ROUTE, 
  JournalData,   
  JournalGroupData 
} from "~/api"
import { fetchIt, IEvent } from "~/utils"
import { Accessor, createSignal, Setter, Signal } from "solid-js"
import type { OutputData } from "@editorjs/editorjs"
import { thisArrayObjects } from "~/common"
import { useTabContext } from "../components"
import { JournalEventMap } from "./event"
import { useThisEditorContext } from "~/libs/editor"

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
  $open(journalId: string): Promise<void>
  $getAll(): Promise<JournalData[]>
  $save(journalId: string, data: OutputData): Promise<{} | null>
}

export function createJournal(event: IEvent<JournalEventMap>): IThisJournalContext {
  const { $updateTab, $getFocusedTab, $removeTab } = useTabContext()
  const { $cache, $open } = useThisEditorContext()

  const [$currentlyOpened, $setCurrentlyOpened] = createSignal<JournalData>()
  const [$currentGroup, $setCurrentGroup] = createSignal<JournalGroupData>()
  const [fileTree, setFileTree] = createSignal([] as JournalData[])

  const getCurrentJournalGroupId = () => {
    console.assert($currentGroup(), '[panic] currentGroup data should NOT be null or undefined')

    return $currentGroup()?.id!
  }

  event.$on('journal__clickingJournal', (data) => {
    const focusedTab = $getFocusedTab()
    $updateTab(focusedTab.id, data.name)
  })

  return {
    $currentlyOpened, 
    $setCurrentlyOpened,
    $currentGroup, 
    $setCurrentGroup,
    $fileTree: [fileTree, setFileTree],
    async $create(data) {
      console.log('[journal] creating', data, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      return (await fetchIt<JournalData>('POST', `${JOURNAL_ROUTE}?id=${currentJournalGroupId}`, data))!
    },
    async $open(journalId) {
      console.log('[journal] creating', journalId, '...')
      let lastContent = $cache.get(journalId) ?? fileTree().find(it => it.id === journalId)
      if (lastContent) {
        // 
      }

      $open({
        id: journalId,
        content: lastContent?.content,
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
      return await fetchIt<JournalData[]>('GET', `${JOURNAL_CONTENT_ROUTE}?id=${currentJournalGroupId}`) ?? []
    },
    async $save(journalId, data) {
      console.log('[journal] saving', journalId, '...')
      const currentJournalGroupId = getCurrentJournalGroupId()
      return await fetchIt('POST', `${JOURNAL_AUTO_SAVE_ROUTE}?id=${currentJournalGroupId}&journal=${journalId}`, data)
    }
  }
}