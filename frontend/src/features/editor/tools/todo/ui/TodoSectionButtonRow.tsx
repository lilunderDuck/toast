import { Button, ButtonSizeVariant, FlexCenterY } from "~/components";

import stylex from "@stylexjs/stylex"
import { useTodoDataContext } from "../data";
import { Show } from "solid-js";
import { useTodoSectionContext } from "./TodoSectionProvider";

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
      <Button size$={ButtonSizeVariant.sm} onClick={showTodoInput$}>
        Create todo
      </Button>
      <Show when={sectionId$ === -1337}>
        <Button size$={ButtonSizeVariant.sm} onClick={showSectionInput$}>
          Create section
        </Button>
      </Show>
    </FlexCenterY>
  )
}