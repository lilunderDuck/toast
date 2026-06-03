import type { ParentProps } from "solid-js"
// ...
import { css } from "molcss"

export function ContextMenuItemIcon(props: ParentProps) {
  return (
    <div class={css`
      width: 22;
      height: 22;
      margin-right: 5;
      display: flex;
      justify-content: center;
      align-items: center;
    `}>
      {props.children}
    </div>
  )
}