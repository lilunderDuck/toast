import type { ParentProps } from "solid-js"
// ...
import { css } from "molcss"

export function DropdownMenuItemIcon(props: ParentProps) {
  return (
    <div class={css`
      width: 22px;
      height: 22px;
      margin-right: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    `}>
      {props.children}
    </div>
  )
}