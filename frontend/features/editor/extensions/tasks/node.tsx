import { RANDOM_STRING } from "macro-def"
// ...
import { TreeViewProvider, TreeViewRenderer, type TreeViewComponentProps } from "~/features/tree-view"
// ...
import "./node.css"
// ...
import { TaskDataProvider, type AnyTaskData, type TaskData, type TaskSectionData } from "./provider"
import { Task, TaskSection } from "./components"
import { getRandomNumberFrom } from "~/utils"

export default function TaskNodeView() {
  // const { attrs$ } = useSolidNodeView<TasksAttribute>()
  return (
    // <TaskDataProvider attrs$={attrs$()}>
    <TreeViewProvider<AnyTaskData> onUpdate$={() => {}} data$={{
      tree: [
        {
          id: 1000, child: [
            { id: 1200, child: [] },
            { id: 1100, child: [] },
          ]
        },
      ],
      storage: {
        1000: {
          name: "Test",
          type: TaskType.SECTION,
          id: getRandomNumberFrom(0, 100_000_000)
        },
        1100: {
          name: "Test",
          completed: false,
          description: "This is a test",
          type: TaskType.TASK,
          id: getRandomNumberFrom(0, 100_000_000)
        },
        1200: {
          name: "Test",
          completed: true,
          description: "This is a test",
          type: TaskType.TASK,
          id: getRandomNumberFrom(0, 100_000_000)
        }
      }
    }}>
      <TaskDataProvider>
        <TreeViewRenderer<AnyTaskData>
          Parent$={TaskComponent}
          Leaf$={TaskComponent}
          name$={RANDOM_STRING(5)}
        />
      </TaskDataProvider>
    </ TreeViewProvider>
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