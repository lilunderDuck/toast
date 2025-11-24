import { For, type Accessor, type JSX } from "solid-js"
import { useTaskDataContext, type TaskData } from "../provider"

interface ITaskListProps {
  children: (data: TaskData, index: Accessor<number>) => JSX.Element
}

export function TaskList(props: ITaskListProps) {
  const { data$ } = useTaskDataContext()

  return (
    <For each={data$.tasks}>
      {props.children}
    </For>
  )
}