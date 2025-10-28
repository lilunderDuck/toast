import { createAsync } from "@solidjs/router"
import { pluginEvent } from "~/plugins"
// ...
import { GetGroup } from "~/wailsjs/go/group/Exports"
import type { group } from "~/wailsjs/go/models"

export default function journalGroupData(groupId: string) {
  return createAsync(async() => {
    const [journalGroupData] = await Promise.all([
      GetGroup(groupId),
    ])

    pluginEvent.emit$(PluginEvent.JOURNAL_LOADED)

    return {
      explorerTreeData$: journalGroupData.explorer as group.ExplorerData
    }
  })
}