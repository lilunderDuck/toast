import { createSignal, For, lazy, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { AnyTodoSection, TodoSchema } from "~/features/editor/types"
import { FlexCenterY, Spacer } from "~/components"
// ...
import TodoButtonRow from "../stuff/TodoButtonRow"
import { DeleteButton, EditButton } from "../stuff"
import { useTodoDataContext } from "../TodoDataProvider"
import { TodoSectionProvider, useTodoSectionContext } from "./TodoSectionProvider"
import Todo from "./Todo"

const style = stylex.create({
  section: {
    marginBottom: 30
  },
  todoList: {
    marginBottom: 10
  },
  button: {
    flexShrink: 0,
    gap: 10
  }
})

interface ITodoSectionProps {
  id: AnyTodoSection["id"]
}

export default function TodoSection(props: ITodoSectionProps) {
  const { readOnly, cache$, createTodo$, createSection$, deleteTodo$ } = useTodoDataContext()

  const thisSectionId = props.id
  const DO_NOT_RENDER_THIS = 1
  const [todos, setTodos] = createSignal([
    // due to the fact that todo component for some reason rendered twice when it's created for the first time,
    // this is a hacky solution to solve that.
    // 
    // very funky.
    DO_NOT_RENDER_THIS,
    ...cache$.get(thisSectionId)!.todo
  ] as const) 
  
  const CreateTodoInput = lazy(() => import('../input/CreateTodoInput'))
  const CreateTodoSectionInput = lazy(() => import('../input/CreateTodoSectionInput'))

  const createTodo = (data: TodoSchema) => {
    const newData = createTodo$(thisSectionId, data)
    setTodos(prev => [...prev, newData])
  }

  const deleteTodo = (id: number) => {
    const newData = deleteTodo$(thisSectionId, id)
    if (!newData) return

    setTodos(() => [DO_NOT_RENDER_THIS, ...newData])
  }
  
  const Inputs = () => {
    const { isShowingSectionInput$, isShowingTodoInput$ } = useTodoSectionContext()
  
    const [isShowingTodoInput, setisShowingTodoInput] = isShowingTodoInput$
    const [isShowingSectionInput, setisShowingSectionInput] = isShowingSectionInput$

    return (
      <>
        <Show when={isShowingTodoInput()}>
          <CreateTodoInput 
            onClose$={() => setisShowingTodoInput(false)} 
            onSubmit$={createTodo}
          />
        </Show>
        <Show when={isShowingSectionInput()}>
          <CreateTodoSectionInput 
            onClose$={() => setisShowingSectionInput(false)} 
            onSubmit$={(data) => {
              createSection$(data.name)
              setisShowingSectionInput(false)
            }}
          />
        </Show>
      </>
    )
  }

  return (
    <TodoSectionProvider {...props}>
      <section {...stylex.attrs(style.section)}>
        <Show when={!readOnly}>
          <TodoButtonRow />
        </Show>
        <div {...stylex.attrs(style.todoList)}>
          <For each={todos()}>
            {it => {
              if (it === DO_NOT_RENDER_THIS) {
                return null
              }

              return (
                <Todo {...it}>
                  <Spacer />
                  <FlexCenterY {...stylex.attrs(style.button)}>
                    <DeleteButton onClick={() => deleteTodo(it.id)} />
                    <EditButton onClick={() => console.warn("haven't added that yet")} />
                  </FlexCenterY>
                </Todo>
              )
            }}
          </For>
        </div>
        <Inputs />
      </section>
    </TodoSectionProvider>
  )
}