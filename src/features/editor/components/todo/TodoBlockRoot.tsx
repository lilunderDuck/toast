import { For } from "solid-js"
// ...
import type { TodoSavedData } from "../../types"
import type { BlockComponentProps } from "../../utils"
import { TodoDataProvider, useTodoDataContext } from "./TodoDataProvider"
import TodoSection from "./variant/TodoSection"

export interface ITodoBlockRoot extends BlockComponentProps<TodoSavedData> {
  // ...
}

export function TodoBlockRoot(props: ITodoBlockRoot) {
  const List = () => {
    const { sections$ } = useTodoDataContext()

    return (
      <For each={sections$()}>
        {(it) => (
          <TodoSection id={it.id} />
        )}
      </For>
    )
  }

  return (
    <TodoDataProvider data={props}>
      <List />
    </TodoDataProvider>
  )
}