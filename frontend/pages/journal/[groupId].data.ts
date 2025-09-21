import { createAsync } from "@solidjs/router"
// ...
import { GetGroup } from "~/wailsjs/go/journal/GroupExport"
import type { journal } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: number) {
  return createAsync(async() => {
    const [journalGroupData] = await Promise.all([
      GetGroup(groupId),
    ])

    return {
      explorerTreeData$: journalGroupData.explorer as journal.ExplorerData
    }
  })
}