import { createAsync } from "@solidjs/router"
// ...
import { GetExplorerTree } from "~/wailsjs/go/journal/GroupExport"
import type { journal } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: number) {
  return createAsync(async() => {
    const [explorerTreeData] = await Promise.all([
      GetExplorerTree(groupId),
      // Example: infinite loading screen (this is because the app doesn't finish in time)
      // await InitJournal(groupId)
    ])

    console.log("data", explorerTreeData)

    return {
      explorerTreeData$: explorerTreeData as journal.ExplorerData
    }
  })
}