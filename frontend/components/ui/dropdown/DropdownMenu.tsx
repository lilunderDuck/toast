import { type DropdownMenuRootProps, Root } from "@kobalte/core/dropdown-menu"

export function DropdownMenu(props: DropdownMenuRootProps) {
  return <Root gutter={4} {...props} />
}