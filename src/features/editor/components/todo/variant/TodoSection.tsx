import { createSignal, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TodoSection.module.css"
// ...
import { useTodoDataContext, TodoSectionProvider, type StripedTodoSectionData } from "../provider"
import { TodoList, TodoInputs, TodoButtonRow } from "../stuff"
import { FlexCenterY, Spacer } from "~/components"
import { BsCaretDownFill } from "solid-icons/bs"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  section: {
    marginBottom: 30
  },
  sectionName: {
    gap: 10,
    marginBottom: 4
  },
  todoList: {
    marginBottom: 10
  },
  button: {
    flexShrink: 0,
    gap: 10
  }
})

interface ITodoSectionProps extends StripedTodoSectionData {}

export default function TodoSection(props: ITodoSectionProps) {
  const { readOnly } = useTodoDataContext()
  const [isShowingTodoList, setIsShowingTodoList] = createSignal(true)

  const Name = () => (
    <FlexCenterY {...stylex.attrs(style.sectionName)}>
      <Show when={`${props.id}` !== 'uncategorized'}>
        <BsCaretDownFill 
          onClick={() => setIsShowingTodoList(prev => !prev)} 
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
        props.id !== 'uncategorized' ? __style.section : ''
      )}>
        <Name />
        <Show when={isShowingTodoList()}>
          <TodoList />
        </Show>
        <TodoInputs />
      </section>
    </TodoSectionProvider>
  )
}