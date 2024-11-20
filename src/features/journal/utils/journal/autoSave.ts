import { JOURNAL_AUTO_SAVE_ROUTE, JournalGroupData } from "~/api"
import { debounce, fetchIt } from "~/utils"
import { JSONContent } from "@tiptap/core"
import { Accessor } from "solid-js"

export type CurrentJournalGroup = Accessor<JournalGroupData | undefined>
export function saveJournalData(currentGroup: CurrentJournalGroup, journalId: string, data: JSONContent) {
  const groupId = currentGroup()?.id
  return fetchIt('POST', `${JOURNAL_AUTO_SAVE_ROUTE}?id=${groupId}&journal=${journalId}`, data)
}

export const autoSaveJournal = debounce(saveJournalData, 1000)