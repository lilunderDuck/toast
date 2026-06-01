import { splitProps } from "solid-js"
import type { HTMLAttributes } from "~/utils"
import { css } from "molcss"

const menuLabel = css`
  padding-inline: 0.5rem;
  padding-block: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
`

export interface IDropdownMenuLabel extends HTMLAttributes<"div"> {
  inset?: boolean
}

export function DropdownMenuLabel(props: IDropdownMenuLabel) {
  const [, rest] = splitProps(props, ["class", "inset"])
  return (
    <div
      class={`${menuLabel} ${props.class ?? ""}`}
      {...rest}
    />
  )
}