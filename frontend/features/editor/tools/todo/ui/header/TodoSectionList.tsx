import { For } from "solid-js"
import { useTodoDataContext } from "../../data"
import { TodoSection } from "../../variant/TodoSection"

interface ITodoSectionListProps {
  // ...
}

export function TodoSectionList(props: ITodoSectionListProps) {
  const { data$ } = useTodoDataContext()
  
  return (
    <div>
      <For each={data$.todos}>
        {it => <TodoSection {...it} />}
      </For>
    </div>
  )
}