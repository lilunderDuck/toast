import { MERGE_CLASS } from "macro-def"
import { type ParentProps } from "solid-js"
// ...
import { type TreeViewComponentProps } from "~/features/tree-view"
// ...
import stylex from "@stylexjs/stylex"
import "./Task.css"
// ...
import { TaskProvider, type TaskData } from "../provider"
import { TaskContent } from "./stuff"

const style = stylex.create({
  task: {
    // 
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
  return (
    <TaskProvider data$={props}>
      <div
        class={MERGE_CLASS("task", stylex.attrs(style.task))}
        data-completed={props.data$.completed}
      >
        <TaskContent />
        <div {...stylex.attrs(style.task__subTask)}>
          {props.children}
        </div>
      </div>
    </TaskProvider>
  )
}