import { createAsync } from "@solidjs/router"
import { onCleanup } from "solid-js"
// ...
import { GetExplorerTree, InitJournal, CleanUpJournal, GetAllJournal } from "~/wailsjs/go/journal/GroupExport"
import type { journal } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: number) {
  onCleanup(() => {
    CleanUpJournal(groupId)
  })

  return createAsync(async() => {
    // The app must initialize all neccessary stuff in the backend
    // before start doing anything, otherwise, weird stuff will happen
    await InitJournal(groupId)
    
    const [explorerTreeData, journalsMetadata] = await Promise.all([
      GetExplorerTree(groupId),
      GetAllJournal(groupId),
      // Example: infinite loading screen (this is because the app doesn't finish in time)
      // await InitJournal(groupId)
    ])

    return {
      explorerTreeData$: explorerTreeData as journal.ExplorerNode[],
      journalsMetadata$: journalsMetadata as journal.JournalData[]
    }
  })
}