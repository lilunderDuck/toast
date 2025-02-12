import { createSignal, ParentProps, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from './Todo.module.css'
// ...
import { Checkbox, FlexCenterY } from "~/components"
import { ITodo } from "~/features/editor/types"
import { mergeClassname } from "~/utils"
// ...
import { EditAndDeleteButtonRow } from "../stuff"
import { useTodoDataContext, useTodoSectionContext } from "../provider"

const style = stylex.create({
  todo: {
    gap: 10
  },
  textWrapper: {
    width: '100%'
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
  const { id: sectionId } = useTodoSectionContext()
  const { 
    toggleMarkTodoAsCompleted$, 
    isThisTodoCompleted$, 
    deleteTodo$, 
    setSomeTodoToEditMode$ 
  } = useTodoDataContext()

  const checkboxChanged = (isChecked: boolean) => {
    setIsCheckboxChecked(isChecked)
    toggleMarkTodoAsCompleted$(sectionId, props.id, isChecked)
  }

  return (
    <FlexCenterY class={mergeClassname(
      isCheckboxChecked() ? __style.checked : '',
      __style.todo,
      stylex.attrs(style.todo)
    )}>
      <div {...stylex.attrs(style.checkbox)}>
        <Checkbox onChange={checkboxChanged} defaultChecked={isThisTodoCompleted$(sectionId, props.id)} />
      </div>
      <div {...stylex.attrs(style.textWrapper)}>
        <div class={__style.name}>
          {props.name}
        </div>
        <Show when={props.description}>
          <span class={mergeClassname(
            __style.description,
            stylex.attrs(style.description)
          )}>
            {props.description}
          </span>
        </Show>
      </div>
      <EditAndDeleteButtonRow 
        class={__style.editOptions} 
        onClickingEdit$={() => {
          setSomeTodoToEditMode$(sectionId, props.id, true)
        }}
        onClickingDelete$={() => {
          deleteTodo$(sectionId, props.id)
        }}
      />
    </FlexCenterY>
  )
}