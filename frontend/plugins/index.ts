import type { Node } from "@tiptap/core"
// ...
import { createEvent } from "~/utils"

export const pluginEvent = createEvent<{
  [PluginEvent.REGISTER_EDITOR_NODE]: (nodeExtension: Node) => any,
  // ...
  [PluginEvent.JOURNAL_LOADED]: () => any
}>()

export * from "./editor"