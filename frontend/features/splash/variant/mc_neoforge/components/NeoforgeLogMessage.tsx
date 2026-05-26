import stylex from "@stylexjs/stylex"
import { For, type Accessor } from "solid-js"
import type { ILogMessage } from "../utils"
import { CLS } from "macro-def"
import "~/styles/animation.css"

const style = stylex.create({
  messageLog: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingLeft: 10,
    paddingBottom: 5
  },
  messageLog__line: {
    fontSize: "14px",
    opacity: 1,
    maxHeight: "20px",
    transition: "opacity 0.5s ease, max-height 0.5s ease, transform 0.3s ease",
    transform: "translateY(0)",
    marginBottom: 5
  },
  messageLog__lineFading: {
    animation: "animation_fadeOut 2.75s ease-in-out forwards"
  },
})

interface INeoforgeLogMessageProps {
  messages$: Accessor<ILogMessage[]>
}

export function NeoforgeLogMessage(props: INeoforgeLogMessageProps) {
  return (
    <div {...stylex.attrs(style.messageLog)}>
      <For each={props.messages$()}>
        {it => (
          <div 
            class={`${CLS(style.messageLog__line)} ${it.isFading$ ? CLS(style.messageLog__lineFading) : ""}`}
          >
            {it.text$}
          </div>
        )}
      </For>
    </div>
  )
}