import stylex from "@stylexjs/stylex"
import { createSignal, Show } from "solid-js"
import { Input, Tooltip } from "~/components"
import { useTablesDataContext } from "../../provider"
import { TableTabList } from "./TableTabList"

const style = stylex.create({
  title: {
    width: "100%",
    paddingBlock: 5
  },
  title__headingWrap: {
    marginBottom: 8
  },
  title__heading: {
    width: "fit-content",
    userSelect: "none",
    cursor: "pointer"
  },
  title__display: {
    width: "100%"
  }
})

export function TableTitle() {
  const { title$ } = useTablesDataContext()
  const [isShowingTitleInput, setIsShowingTitleInput] = createSignal(false)

  let inputRef!: Ref<"input">

  const keydownHandler: EventHandler<"input", "onKeyDown"> = (keyboardEvent) => {
    const keyPressed = keyboardEvent.key.toLowerCase()

    switch (keyPressed) {
      case "esc":
        return discardChanges()
      case "enter":
        return updateTitle()

      default:
        break;
    }
  }

  const discardChanges = () => {
    setIsShowingTitleInput(false)
  }

  const updateTitle = () => {
    setIsShowingTitleInput(false)
    title$.set$(inputRef.value)
  }

  const showInput = () => {
    setIsShowingTitleInput(true)
    inputRef.focus()
  }

  const titleDisplay = () => title$.get$() === "" ? "Untitled" : title$.get$()

  return (
    <section {...stylex.attrs(style.title)}>
      <div {...stylex.attrs(style.title__headingWrap)}>
        <Show when={isShowingTitleInput()} fallback={
          <h2 onClick={showInput} {...stylex.attrs(style.title__heading)}>
            <Tooltip label$="Click to change table title">
              {titleDisplay()}
            </Tooltip>
          </h2>
        }>
          <Input
            placeholder={titleDisplay()}
            value={title$.get$()}
            onKeyDown={keydownHandler}
            onBlur={discardChanges}
            ref={inputRef}
          />
        </Show>
      </div>
      <TableTabList />
    </section>
  )
}