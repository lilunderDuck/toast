import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import type { Ref } from "~/utils"
// ...
import { useCodeBlockContext } from "../provider"

const style = stylex.create({
  input__content: {
    minWidth: 30,
    userSelect: "none",
    whiteSpace: "break-spaces"
  },
  input__contentEmpty: {
    color: "var(--subtext0)"
  }
})

export interface ICodeBlockContentProps {
  ref: Ref<"code">
  onClick?: () => void
}

export function CodeBlockContent(props: ICodeBlockContentProps) {
  const { data$ } = useCodeBlockContext()

  return (
    <div {...stylex.attrs(style.input__content)} onClick={props.onClick}>
      <code
        class={`language-${data$().lang}`}
        ref={props.ref}
      >
        <Show when={data$().codeContent === ""} fallback={data$().codeContent}>
          <span {...stylex.attrs(style.input__contentEmpty)}>
            Nothing in here
          </span>
        </Show>
      </code>
    </div>
  )
}