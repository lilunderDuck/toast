import { ContextMenuRootProps, Root } from "@kobalte/core/context-menu"

export function ContextMenu(props: ContextMenuRootProps) {
  return <Root gutter={4} {...props} />
}