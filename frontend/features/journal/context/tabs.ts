import { type Accessor, createSignal } from "solid-js"
// ...
import {  } from "~/utils"
import { api_getJournal, JournalType } from "~/api/journal"
// ...

export type TabData = {
  name$: string
  journalId$: number
}

export interface ITabUtils {
  tabs$: Accessor<TabData[]>
  spawn$(tabId: number): void
  update$(tabId: number): void
}

export function createTab(getCurrentJournalGroupId: () => number): ITabUtils {
  const [tabs, setTabs] = createSignal<TabData[]>([
    { name$: "New tab", journalId$: -1 }
  ])

  let currentActiveTabIndex = 0

  const createTabData = async (tabId: number) => {
    const thisJournal = await api_getJournal(getCurrentJournalGroupId(), tabId, JournalType.journal)
    return {
      name$: thisJournal.name,
      journalId$: tabId
    }
  }

  const spawnTab: ITabUtils["spawn$"] = async(tabId) => {
    const newTabData = await createTabData(tabId)
    setTabs(prev => [...prev, newTabData])
  }

  const updateTab: ITabUtils["update$"] = async(tabId) => {
    const newTabData = await createTabData(tabId)
    setTabs(prev => {
      prev[currentActiveTabIndex] = newTabData

      return [...prev]
    })
  }

  return {
    tabs$: tabs,
    spawn$: spawnTab,
    update$: updateTab,
  }
}