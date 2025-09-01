import { type NodeConfig } from "@tiptap/core"
import { Transaction } from "prosemirror-state"

export type ThisNodeInputRule = ThisParameterType<NonNullable<NodeConfig["addCommands"]>>

export function insertNodeAtCurrentPosition<T extends {}>(
  thisInputRule: ThisNodeInputRule,
  tr: Transaction,
  data: T
): true {
  const { $from, $to } = tr.selection

  // here we use tr.mapping.map to map the position between transaction steps
  const from = tr.mapping.map($from.pos)
  const to = tr.mapping.map($to.pos)
  const node = thisInputRule.type.create(data)
  tr.replaceRangeWith(from, to, node)
  return true
}