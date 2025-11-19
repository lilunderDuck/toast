import { Group, Portal, RadioGroup, Sub, Trigger } from "@kobalte/core/dropdown-menu"

import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  dropdown__trigger: {
    outline: "none"
  }
})

export const DropdownMenuTrigger: typeof Trigger = (props) => {
  return <Trigger {...props} class={MERGE_CLASS(stylex.attrs(style.dropdown__trigger), props!)} />
}

export const DropdownMenuPortal = Portal
export const DropdownMenuSub = Sub
export const DropdownMenuGroup = Group
export const DropdownMenuRadioGroup = RadioGroup