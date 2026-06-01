import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const menuShortcut = css`
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
`

export function DropdownMenuShortcut(props: HTMLAttributes<"span">) {
  return <span class={`${menuShortcut} ${props.class ?? ""}`} {...props} />
}