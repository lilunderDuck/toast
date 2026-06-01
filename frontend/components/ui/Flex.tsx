import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const spacer = css`
  flex: 1 1 0%;
  place-self: stretch;
`

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={`${spacer} ${props.class ?? ""}`} />
  )
}