import { BsListCheck, BsUiChecks } from "solid-icons/bs"
import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, FlexCenterY, Tooltip } from "~/components"
// ...
import { useTodoDataContext } from "../data"
import { useTodoSectionContext } from "./TodoSectionProvider"

const style = stylex.create({
  buttonRow: {
    gap: 10,
    flexShrink: 0
  }
})

export function TodoSectionButtonRow() {
  const {  } = useTodoDataContext()
  const { sectionId$, showSectionInput$, showTodoInput$ } = useTodoSectionContext()

  return (
    <FlexCenterY {...stylex.attrs(style.buttonRow)}>
      <Tooltip label$="Create todo">
        <Button size$={ButtonSizeVariant.icon} onClick={showTodoInput$}>
          <BsUiChecks />
        </Button>
      </Tooltip>
      <Show when={sectionId$ === -1337}>
        <Tooltip label$="Create section">
          <Button size$={ButtonSizeVariant.icon} onClick={showSectionInput$}>
            <BsListCheck />
          </Button>
        </Tooltip>
      </Show>
    </FlexCenterY>
  )
}