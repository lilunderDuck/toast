import { Group, Portal, RadioGroup, Sub, Trigger } from "@kobalte/core/dropdown-menu"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  dropdown__trigger: {
    outline: "none"
  }
})

export const DropdownMenuTrigger: typeof Trigger = (props) => {
  return <Trigger {...props} class={`${stylex.attrs(style.dropdown__trigger).class} ${props!.class}`} />
}

export const DropdownMenuPortal = Portal
export const DropdownMenuSub = Sub
export const DropdownMenuGroup = Group
export const DropdownMenuRadioGroup = RadioGroup