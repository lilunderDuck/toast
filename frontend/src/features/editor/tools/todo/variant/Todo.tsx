import { Show } from "solid-js"
// ...
import { Checkbox, FlexCenterY, Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Todo.module.css"
// ...
import { TodoData } from "../TodoBlock"
import { TodoButtonRow } from "../ui"

const style = stylex.create({
  todo: {
    gap: 10,
    paddingBlock: 2,
  },
  checkbox: {
    marginTop: 3,
    marginBottom: 'auto'
  },
  description: {
    color: 'var(--gray11)'
  },
  button: {
    marginBottom: 'auto'
  }
})

interface ITodoProps extends TodoData {
  // ...
}

export function Todo(props: ITodoProps) {
  return (
    <FlexCenterY {...stylex.attrs(style.todo)} id={__style.todo}>
      <div {...stylex.attrs(style.checkbox)}>
        <Checkbox />
      </div>
      <div>
        <div>{props.name}</div>
        <Show when={props.description}>
          <div {...stylex.attrs(style.description)}>{props.description}</div>
        </Show>
      </div>
      <Spacer />
      <div id={__style.button} {...stylex.attrs(style.button)}>
        <TodoButtonRow todoId$={props.id} />
      </div>
    </FlexCenterY>
  )
}