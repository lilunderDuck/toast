import { RANDOM_STRING } from "macro-def"
// ...
import { makeId } from "~/utils"
import { TreeViewProvider, TreeViewRenderer } from "~/features/tree-view"
// ...
import { TaskDataProvider, type TaskData } from "./provider"
import { Task } from "./components"

export default function TaskNodeView() {
  // const { attrs$ } = useSolidNodeView<TasksAttribute>()
  return (
    // <TaskDataProvider attrs$={attrs$()}>
    <TreeViewProvider<TaskData> onUpdate$={(data) => console.log('updated tree:', data)} data$={{
      tree: [
        { id: 1000, child: [] },
        { id: 1100, child: [
          { id: 1200, child: [] }
        ] },
      ],
      storage: {
        1000: {
          name: "Test",
          completed: false,
          id: makeId(5),
        },
        1100: {
          name: "Test",
          completed: false,
          id: makeId(5),
          description: "This is a test"
        },
        1200: {
          name: "Test",
          completed: true,
          id: makeId(5),
          description: "This is a test"
        }
      }
    }}>
      <TaskDataProvider>
        <TreeViewRenderer Parent$={Task} Leaf$={Task} name$={RANDOM_STRING(5)} />
      </TaskDataProvider>
    </ TreeViewProvider>
  )
}