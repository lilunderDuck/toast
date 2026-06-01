import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const menuLabel = css`
  padding-inline: 0.5rem;
  padding-block: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
`

export interface IContextMenuLabel extends HTMLAttributes<"div"> {
  inset?: boolean
}

export function ContextMenuLabel(props: IContextMenuLabel) {
  return (
    <div
      class={`${menuLabel} ${props.class ?? ""}`}
      {...props}
    />
  )
}