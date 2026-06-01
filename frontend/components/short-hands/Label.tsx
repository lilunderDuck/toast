import { css } from "molcss"

const label = css`
  font-size: 13.5; // sub-pixel perfect 👍
  font-weight: bold;
  user-select: none;
`

export function Label(props: HTMLAttributes<"label">) {
  return <label {...props} class={`${label} ${props.class ?? ""}`} />
}