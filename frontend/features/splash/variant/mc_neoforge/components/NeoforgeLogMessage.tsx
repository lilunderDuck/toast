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
  padding-bottom: 5px;
`

const messageLog__line = css`
  font-size: 14px;
  opacity: 1;
  max-height: 20px;
  transition: opacity 0.5s ease, max-height 0.5s ease, transform 0.3s ease;
  transform: translateY(0);
  margin-bottom: 5;
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