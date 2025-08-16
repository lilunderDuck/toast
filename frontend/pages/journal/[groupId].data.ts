import { createAsync } from "@solidjs/router"
// ...
import { GetExplorerTree } from "~/wailsjs/go/journal/GroupExport"
import { journal } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: number) {
  return createAsync(async() => {
    const [explorerTreeData] = await Promise.all([
      GetExplorerTree(groupId)
    ])

    return {
      explorerTreeData$: explorerTreeData as journal.ExplorerTree
    }
  })
}