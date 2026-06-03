import { Group, Portal, RadioGroup, Sub, Trigger } from "@kobalte/core/dropdown-menu"
// ...
import { css } from "molcss"

const dropdown__trigger = css`
  outline: none;
`

export const DropdownMenuTrigger: typeof Trigger = (props) => {
  return <Trigger {...props} class={`${dropdown__trigger} ${props!.class}`} />
}

export const DropdownMenuPortal = Portal
export const DropdownMenuSub = Sub
export const DropdownMenuGroup = Group
export const DropdownMenuRadioGroup = RadioGroup