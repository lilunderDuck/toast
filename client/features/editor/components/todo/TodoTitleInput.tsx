import { Show } from "solid-js"
import { useTodoDataContext } from "./provider/TodoDataProvider"

export default function TodoTitleInput() {
  const { readOnly } = useTodoDataContext()

  return (
    <Show when={readOnly}>
      a
    </Show>
  )
}