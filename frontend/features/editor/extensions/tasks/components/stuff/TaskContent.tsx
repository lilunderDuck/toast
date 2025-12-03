import { MERGE_CLASS } from "macro-def"
import { lazy, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Checkbox } from "~/components"
// ...
import { useTaskContext, useTaskDataContext } from "../../provider"
import { TaskButtonRow } from "./TaskButtonRow"
import { useTreeViewContext } from "~/features/tree-view"

const style = stylex.create({
  task__content: {
    position: "relative"
  },
  task__nameWrap: {
    display: "flex",
    paddingInline: 5,
    alignItems: "center",
    gap: 10
  },
  task__descriptionWrap: {
    paddingLeft: "2.7rem",
    fontSize: 13,
    color: "var(--gray11)"
  }
})

const TaskInput = lazy(() => import("./TaskInput"))

export function TaskContent() {
  const { isShowingInput$, data$ } = useTaskContext()
  const { setIsCompleted$ } = useTaskDataContext()
  const { editNodeData$ } = useTreeViewContext()

  return (
    <div class={MERGE_CLASS("task__content", stylex.attrs(style.task__content))}>
      <Show when={!isShowingInput$()} fallback={
        <TaskInput 
          value$={data$()} 
          hideOnSubmit$={true}
          onSubmit$={(data) => {
            editNodeData$(data$().nodeId$, (prev) => ({ ...prev,...data }))
          }} 
        />
      }>
        <div {...stylex.attrs(style.task__nameWrap)}>
          <Checkbox
            checked={data$().data$.completed}
            onChange={value => setIsCompleted$(data$().nodeId$, value)}
          />
          <p class="task__name">
            {data$().data$.name}
          </p>
        </div>
        <Show when={data$().data$.description}>
          <div {...stylex.attrs(style.task__descriptionWrap)}>
            <p class="task__description">
              {data$().data$.description}
            </p>
          </div>
        </Show>
        <TaskButtonRow />
      </Show>
    </div>
  )
}