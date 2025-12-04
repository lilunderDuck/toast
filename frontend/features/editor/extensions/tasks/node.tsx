import { RANDOM_STRING } from "macro-def"
// ...
import { TreeViewRenderer, type TreeViewComponentProps } from "~/features/tree-view"
// ...
import { type AnyTaskData, type TaskData, type TaskSectionData } from "./provider"
import { Task, TaskSection } from "./components"

export default function TaskNodeView() {
  return (
    <TreeViewRenderer<AnyTaskData>
      Parent$={TaskComponent}
      Leaf$={TaskComponent}
      name$={RANDOM_STRING(5)}
    />
  )
}

function TaskComponent(props: TreeViewComponentProps<AnyTaskData>) {
  switch (props.data$.type) {
    case TaskType.SECTION:
      return <TaskSection {...props as TreeViewComponentProps<TaskSectionData>} />
    case TaskType.TASK:
      return <Task {...props as TreeViewComponentProps<TaskData>} />
    default:
      // @ts-ignore
      console.warn("Invalid task type or not being handled:", props.data$.type)
  }
}