import { For, type Accessor } from "solid-js"
// ...
import "~/styles/animation.css"
import { css } from "molcss"
// ...
import type { ILogMessage } from "../utils"

const messageLog = css`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding-left: 10px;
  padding-bottom: 15px;
`

const messageLog__line = css`
  opacity: 1;
  transition: opacity 2s ease, max-height 0.5s ease, transform 0.3s ease;
  transform: translateY(0);
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`

const messageLog__lineFading = css`
  animation: animation_fadeOut 2.75s ease-in-out forwards;
`

interface INeoforgeLogMessageProps {
  messages$: Accessor<ILogMessage[]>
}

export function NeoforgeLogMessage(props: INeoforgeLogMessageProps) {
  return (
    <div class={messageLog}>
      <For each={props.messages$()}>
        {it => (
          <div class={`${messageLog__line} ${it.isFading$ ? messageLog__lineFading : ""}`}>
            {it.text$}
          </div>
        )}
      </For>
    </div>
  )
}