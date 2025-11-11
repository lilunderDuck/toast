import { Group, Portal, RadioGroup, Sub, Trigger } from "@kobalte/core/dropdown-menu"

import stylex from "@stylexjs/stylex"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  dropdown__trigger: {
    outline: "none"
  }
})

export const DropdownMenuTrigger: typeof Trigger = (props) => {
  return <Trigger {...props} class={macro_mergeClassnames(stylex.attrs(style.dropdown__trigger), props!)} />
}

export const DropdownMenuPortal = Portal
export const DropdownMenuSub = Sub
export const DropdownMenuGroup = Group
export const DropdownMenuRadioGroup = RadioGroup