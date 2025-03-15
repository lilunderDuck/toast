import { Accessor, createSignal } from "solid-js"
// ...
import { api_getGroup, IJournalGroupData } from "~/api/journal"
import { homeLog } from "~/features/debug"
import { thisArrayObjects } from "~/utils"

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
      //debug-start
      homeLog.logLabel('grid', 'data fetched:', data)
      //debug-end
      return data
    },
    groups$: journalGroups,
    add$(another) {
      setJournalGroups(prev => [...prev, another])
      //debug-start
      homeLog.logLabel('grid', 'added', another)
      //debug-end
    },
    update$(newOne) {
      setJournalGroups(prev => [...thisArrayObjects(prev).replace$(it => it.id === newOne.id, newOne)])
      //debug-start
      homeLog.logLabel('grid', 'updated', newOne)
      //debug-end
    }
  }
}