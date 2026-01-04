import stylex from "@stylexjs/stylex"
import { EditorTooltip } from "~/features/editor"
import { useCodeBlockContext } from "../provider"
import { Show } from "solid-js"

const style = stylex.create({
  input__content: {
    minWidth: 30,
    userSelect: "none",
    whiteSpace: "break-spaces"
  },
  input__contentEmpty: {
    color: "var(--gray11)"
  }
})

export interface ICodeBlockContentProps {
  ref: Ref<"code">
  onClick?: () => void
}

export function CodeBlockContent(props: ICodeBlockContentProps) {
  const { data$ } = useCodeBlockContext()

  return (
    <EditorTooltip label$="Click to change content">
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
    </EditorTooltip>
  )
}