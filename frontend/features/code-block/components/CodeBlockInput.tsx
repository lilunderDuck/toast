import { type ParentProps } from "solid-js"
// ...
import { Kbd, ResizableTextarea } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useCodeBlockContext } from "../provider"

const style = stylex.create({
  input: {
    width: "100%",
    paddingInline: 5,
    paddingBottom: 5
  },
  input__content: {
    minWidth: 30,
    userSelect: "none",
    whiteSpace: "break-spaces"
  },
  input__contentEmpty: {
    color: "var(--gray11)"
  },
  input__shortcutHint: {
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 20
  },
})

interface ICodeBlockContentProps {
  value?: string
  onKeyDown?: EventHandler<"textarea", "onKeyDown">
}

export function CodeBlockInput(props: ParentProps<ICodeBlockContentProps>) {
  const { data$ } = useCodeBlockContext()

  return (
    <>
      <ResizableTextarea
        onKeyDown={props.onKeyDown}
        placeholder="Type something into here..."
        value={data$().codeContent}
      />
      <div {...stylex.attrs(style.input__shortcutHint)}>
        <span>
          <Kbd>Enter</Kbd>: save
        </span>
        <span>
          <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd>: new line
        </span>
      </div>
    </>
  )
}