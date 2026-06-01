import "./JournalHomeRoot.css"
import { JournalHomeRootProvider } from "../provider/JournalHomeRootProvider"
import type { ParentProps } from "solid-js"
import { css } from "molcss"

const home = css`
  width: 100%;
  height: 100%;
  display: flex;
`

export function JournalHomeRoot(props: ParentProps) {
  return (
    <JournalHomeRootProvider>
      <div class={home}>
        {props.children}
      </div>
    </JournalHomeRootProvider>
  )
}