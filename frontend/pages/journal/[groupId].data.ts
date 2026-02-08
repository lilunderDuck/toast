import { createAsync } from "@solidjs/router"
// ...
import { GetGroup } from "~/wailsjs/go/group/Exports"
import type { group } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: string) {
  return createAsync(async() => {
    const [journalGroupData] = await Promise.all([
      GetGroup(groupId),
    ])

    console.log("Group data:", journalGroupData)

    return {
      explorerTreeData$: journalGroupData.explorer as group.ExplorerData
    }
  })
}