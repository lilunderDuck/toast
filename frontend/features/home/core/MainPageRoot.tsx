import "./MainPageRoot.css"
import { MainPageProvider } from "../provider/MainPageProvider"
import type { ParentProps } from "solid-js"
import { css } from "molcss"

const home = css`
  width: 100%;
  height: 100%;
  display: flex;
`

export function MainPageRoot(props: ParentProps) {
  return (
    <MainPageProvider>
      <div class={home}>
        {props.children}
      </div>
    </MainPageProvider>
  )
}