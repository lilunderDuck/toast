import { createEffect, type Setter } from "solid-js"
import { useTaskDataContext } from "./TaskDataProvider"

export function useCurrentEditedTaskEffect(
  isShowingInputSetter: Setter<boolean>,
  condition: (currentTaskId: number | undefined) => boolean
) {
  const { currentEditedTask$ } = useTaskDataContext()
  createEffect(() => {
    const currentTaskId = currentEditedTask$()
    isShowingInputSetter(condition(currentTaskId))
  })
}

export function showTaskInput(taskId: number, setIsShowingInput: Setter<boolean>) {
  const { setCurrentEditedTask$ } = useTaskDataContext()
  setCurrentEditedTask$(taskId)
  setIsShowingInput(true)
}