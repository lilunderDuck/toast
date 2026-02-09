import { createAsync, useParams } from "@solidjs/router"
// ...
import { GetGroup } from "~/wailsjs/go/group/Exports"
import type { group } from "~/wailsjs/go/models"

export default function journalGroupData() {
  const param = useParams()
  const currentGroupId = param.groupId!
  return {
    groupId$: currentGroupId,
    get$: createAsync(async() => {
      const [journalGroupData] = await Promise.all([
        GetGroup(currentGroupId),
      ])

      console.log("Group data:", journalGroupData)

      return {
        explorerTreeData$: journalGroupData.explorer as group.ExplorerData
      }
    })
  }
}