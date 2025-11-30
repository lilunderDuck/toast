import { MERGE_CLASS } from "macro-def"
import { Show, type ParentProps } from "solid-js"
// ...
import { Checkbox } from "~/components"
import { useTreeViewContext, type TreeViewComponentProps } from "~/features/tree-view"
// ...
import stylex from "@stylexjs/stylex"
import "./Task.css"
// ...
import { useTaskDataContext, type TaskData } from "../provider"

const style = stylex.create({
  task: {
    // 
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
  },
  task__subTask: {
    marginLeft: 24,
    paddingTop: 5,
    borderLeft: "1px solid transparent",
    ":hover": {
      borderColor: "var(--gray7)"
    }
  },
  task__subTaskDragIndicator: {
    width: "100%",
    height: 4,
    borderRadius: 6,
    marginRight: 5,
    backgroundColor: "var(--blue9)"
  }
})

interface ITaskProps extends TreeViewComponentProps<TaskData> {
}

export function Task(props: ParentProps<ITaskProps>) {
  const { setIsCompleted$ } = useTaskDataContext()
  const { isDragging$ } = useTreeViewContext()

  return (
    <section 
      class={MERGE_CLASS("task", stylex.attrs(style.task))} 
      data-completed={props.data$.completed}
    >
      <div {...stylex.attrs(style.task__nameWrap)}>
        <Checkbox 
          checked={props.data$.completed} 
          onChange={value => setIsCompleted$(props.nodeId$, value)} 
        />
        <p class="task__name">
          {props.data$.name}
        </p>
      </div>
      <Show when={props.data$.description}>
        <div {...stylex.attrs(style.task__descriptionWrap)}>
          <p class="task__description">
            {props.data$.description}
          </p>
        </div>
      </Show>
      <div {...stylex.attrs(style.task__subTask)}>
        {props.children}
      </div>
    </section>
  )
}