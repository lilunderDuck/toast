import { createSignal, ParentProps, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from './Todo.module.css'
// ...
import { Checkbox, FlexCenterY } from "~/components"
import { ITodo } from "~/features/editor/types"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  todo: {
    gap: 10,
    paddingBlock: 5
  },
  description: {
    fontSize: 14
  },
  checkbox: {
    marginBottom: 'auto',
    marginTop: 2
  },
})

interface ITodoProps extends ITodo {}

export default function Todo(props: ParentProps<ITodoProps>) {
  const [isCheckboxChecked, setIsCheckboxChecked] = createSignal(false)

  return (
    <FlexCenterY class={mergeClassname(
      isCheckboxChecked() ? __style.checked : '',
      stylex.attrs(style.todo)
    )}>
      <div {...stylex.attrs(style.checkbox)}>
        <Checkbox onChange={(isChecked) => setIsCheckboxChecked(isChecked)} />
      </div>
      <div>
        <div class={__style.name}>
          {props.name}
        </div>
        <Show when={props.description}>
          <span class={mergeClassname(
            isCheckboxChecked() ? __style.description : '',
            stylex.attrs(style.description)
          )}>
            {props.description}
          </span>
        </Show>
      </div>
      {props.children}
    </FlexCenterY>
  )
}