import type { ParentProps } from "solid-js"
// ...
import { css } from "molcss"

const kbd = css`
  border-style: solid;
  border-radius: 0.375rem;
  border-color: var(--overlay0);
  border-width: 1px 1px 3px;
  background-color: #131212;
  padding-inline: 0.4em;
  font-family: consolas;
  font-size: 0.8em;
  font-weight: bold;
  white-space: nowrap;
`

export function Kbd(props: ParentProps) {
  return (
    <kbd class={kbd}>
      {props.children}
    </kbd>
  )
}