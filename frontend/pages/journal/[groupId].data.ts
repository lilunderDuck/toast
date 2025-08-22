import { createAsync } from "@solidjs/router"
import { onCleanup } from "solid-js"
// ...
import { GetExplorerTree, InitJournal, CleanUpJournal, GetAllJournal } from "~/wailsjs/go/journal/GroupExport"
import { journal } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: number) {
  onCleanup(() => {
    CleanUpJournal(groupId)
  })

  return createAsync(async() => {
    const [explorerTreeData, journalsMetadata] = await Promise.all([
      GetExplorerTree(groupId),
      GetAllJournal(groupId),
      InitJournal(groupId),
    ])

    return {
      explorerTreeData$: explorerTreeData as journal.ExplorerTree,
      journalsMetadata$: journalsMetadata as journal.JournalData[]
    }
  })
}