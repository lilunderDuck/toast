import { Show } from "solid-js"
import { Checkbox, FlexCenterY, Spacer } from "~/components"
import { TodoData } from "../TodoBlock"
import { TodoButtonRow } from "../ui"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  todo: {
    gap: 10
  }
})

interface ITodoProps extends TodoData {
  // ...
}

export function Todo(props: ITodoProps) {
  return (
    <FlexCenterY {...stylex.attrs(style.todo)}>
      <Checkbox />
      <div>
        <div>{props.name}</div>
        <Show when={props.description}>
          <div>{props.description}</div>
        </Show>
      </div>
      <Spacer />
      <TodoButtonRow todoId$={props.id} />
    </FlexCenterY>
  )
}