import { For } from "solid-js";
import { useTodoDataContext } from "../data";
import { TodoSection } from "../variant/TodoSection";

interface ITodoSectionListProps {
  // define your component props here
}

export function TodoSectionList(props: ITodoSectionListProps) {
  const { data$ } = useTodoDataContext()
  
  return (
    <div>
      <For each={data$().stuff}>
        {it => <TodoSection {...it} />}
      </For>
    </div>
  )
}