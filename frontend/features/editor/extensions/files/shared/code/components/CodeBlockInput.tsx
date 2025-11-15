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
  onExit$(content: string): void
}

export function CodeBlockInput(props: ParentProps<ICodeBlockContentProps>) {
  const { setIsShowingInput$, data$ } = useCodeBlockContext()

  const handleKeyPress: EventHandler<"textarea", "onKeyUp"> = (keyboardEvent) => {
    const keyPressed = keyboardEvent.key.toLowerCase()
    const content = keyboardEvent.currentTarget.value
    switch (keyPressed) {
      case "escape": return callExitEvent(content)
      case "enter":
        if (keyboardEvent.shiftKey) return
        return callExitEvent(content)
    }
  }

  const callExitEvent = (content: string) => {
    setIsShowingInput$(false)
    props.onExit$(content)
  }

  return (
    <>
      <ResizableTextarea
        onKeyDown={handleKeyPress}
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