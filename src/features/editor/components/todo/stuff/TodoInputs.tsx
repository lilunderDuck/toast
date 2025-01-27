import { lazy, Show } from "solid-js"
import { useTodoDataContext, useTodoSectionContext } from "../provider"

export function TodoInputs() {
  const { isShowingSectionInput$, isShowingTodoInput$, id } = useTodoSectionContext()
  const { createTodo$, createSection$ } = useTodoDataContext()
  
  const [isShowingTodoInput, setisShowingTodoInput] = isShowingTodoInput$
  const [isShowingSectionInput, setisShowingSectionInput] = isShowingSectionInput$

  const CreateTodoInput = lazy(() => import('./CreateTodoInput'))
  const CreateTodoSectionInput = lazy(() => import('./CreateTodoSectionInput'))

  return (
    <>
      <Show when={isShowingTodoInput()}>
        <CreateTodoInput 
          onClose$={() => setisShowingTodoInput(false)} 
          onSubmit$={(data) => createTodo$(id, data)}
        />
      </Show>
      <Show when={isShowingSectionInput()}>
        <CreateTodoSectionInput 
          onClose$={() => setisShowingSectionInput(false)} 
          onSubmit$={(data) => createSection$(data)}
        />
      </Show>
    </>
  )
}