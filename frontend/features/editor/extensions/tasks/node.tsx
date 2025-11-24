import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"
import { TaskDataProvider, type TasksAttribute } from "./provider"
import { Task, TaskList } from "./components"
import { makeId } from "~/utils"

export default function TaskNodeView() {
  // const { attrs$ } = useSolidNodeView<TasksAttribute>()
  return (
    // <TaskDataProvider attrs$={attrs$()}>
    <TaskDataProvider attrs$={{
      tasks: [{
        name: "Test",
        completed: false,
        id: makeId(5),
        subTask: [{
          name: "Test",
          completed: false,
          id: makeId(5),
          description: "This is a test"
        },
        {
          name: "Test",
          completed: true,
          id: makeId(5),
          description: "This is a test"
        }]
      }]
    }}>
      <TaskList>
        {it => <Task {...it} />}
      </TaskList>
    </TaskDataProvider>
  )
}