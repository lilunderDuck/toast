import { createAsync } from "@solidjs/router"
import { onCleanup } from "solid-js"
// ...
import { GetExplorerTree, InitJournal, CleanUpJournal } from "~/wailsjs/go/journal/GroupExport"
import { journal } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: number) {
  onCleanup(() => {
    CleanUpJournal(groupId)
  })

  return createAsync(async() => {
    const [explorerTreeData] = await Promise.all([
      GetExplorerTree(groupId),
      InitJournal(groupId)
    ])

    return {
      explorerTreeData$: explorerTreeData as journal.ExplorerTree
    }
  })
}