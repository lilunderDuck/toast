export type TaskData = {
  name: string
  description?: string
  completed: boolean
  subTask?: Omit<TaskData, "subTask">[]
  id: string
}

export type TasksAttribute = {
  tasks: TaskData[]
}