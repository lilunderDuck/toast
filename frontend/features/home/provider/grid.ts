import { Accessor, createSignal } from "solid-js"
// ...
import { api_getGroup, IJournalGroupData } from "~/api/journal"
import { homeLog } from "~/features/debug"
import { arrayObjects } from "~/utils"

export interface IJournalGridUtils {
  groups$: Accessor<IJournalGroupData[]>
  fetch$(): Promise<IJournalGroupData[]>
  add$(another: IJournalGroupData): void
  update$(newOne: IJournalGroupData): void
}

export function createJournalGrid(): IJournalGridUtils {
  const [journalGroups, setJournalGroups] = createSignal<IJournalGroupData[]>([])
  
  return {
    async fetch$() {
      const data = await api_getGroup<undefined>()
      setJournalGroups(data)
      isDevMode && homeLog.logLabel('grid', 'data fetched:', data)
      return data
    },
    groups$: journalGroups,
    add$(another) {
      setJournalGroups(prev => [...prev, another])
      isDevMode && homeLog.logLabel('grid', 'added', another)
    },
    update$(newOne) {
      setJournalGroups(prev => [...arrayObjects(prev).replace$(it => it.id === newOne.id, newOne)])
      isDevMode && homeLog.logLabel('grid', 'updated', newOne)
    }
  }
}