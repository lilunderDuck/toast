import { createSignal, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TodoSection.module.css"
// ...
import { useTodoDataContext, TodoSectionProvider, type StripedTodoSectionData } from "../provider"
import { TodoList, TodoInputs, TodoButtonRow } from "../stuff"
import { FlexCenterY, Spacer } from "client/components"
import { BsCaretDownFill } from "solid-icons/bs"
import { mergeClassname } from "client/utils"

const style = stylex.create({
  section: {
    marginBottom: 20,
    fontSize: 14
  },
  sectionName: {
    gap: 10,
    marginBottom: 2
  },
  todoList: {
    marginBottom: 10
  },
  button: {
    flexShrink: 0,
    gap: 10
  },
  hideTodoArrow: {
    rotate: '270deg'
  }
})

interface ITodoSectionProps extends StripedTodoSectionData {}

export default function TodoSection(props: ITodoSectionProps) {
  const { readOnly, sectionTodoLookup$ } = useTodoDataContext()
  const [isShowingTodoList, setIsShowingTodoList] = createSignal(true)
  const [todos] = sectionTodoLookup$[props.id]

  const Name = () => (
    <FlexCenterY {...stylex.attrs(style.sectionName)}>
      <Show when={`${props.id}` !== 'uncategorized'}>
        <BsCaretDownFill 
          onClick={() => setIsShowingTodoList(prev => !prev)} 
          {...stylex.attrs(isShowingTodoList() ? {} : style.hideTodoArrow)}
        />
        <span>{props.name}</span>
        <Spacer />
      </Show>
      <Show when={!readOnly}>
        <TodoButtonRow class={__style.buttonList} />
      </Show>
    </FlexCenterY>
  )

  return (
    <TodoSectionProvider id={props.id}>
      <section class={mergeClassname(
        stylex.attrs(style.section), 
        `${props.id}` !== 'uncategorized' ? __style.section : ''
      )}>
        <Name />
        <Show when={isShowingTodoList()}>
          <TodoList list={todos()} />
        </Show>
        <TodoInputs />
      </section>
    </TodoSectionProvider>
  )
}