import { getRandomNumberFrom } from "~/utils"

export type TaskData = {
  type: TaskType.TASK
  name: string
  description?: string
  completed: boolean
  id: number
}

export type TaskSectionData = {
  type: TaskType.SECTION
  name: string
  id: number
}

export const DEFAULT_TASK_DATA = {
  [TaskType.TASK]: () => ({
    name: "",
    completed: false,
    id: getRandomNumberFrom(0, 100_000_000),
    type: TaskType.TASK
  }),
  [TaskType.SECTION]: () => ({
    name: "Untitled section",
    id: getRandomNumberFrom(0, 100_000_000),
    type: TaskType.SECTION
  })
}

export interface ITaskDataMapping {
  [TaskType.TASK]: {
    data: TaskData
    schema: TaskInputSchema
  }
  [TaskType.SECTION]: {
    data: TaskSectionData
    schema: never
  }
}

export type AnyTaskData = TaskData | TaskSectionData

export type TasksAttribute = {
  tasks: TaskData[]
}

export type TaskInputSchema = Omit<TaskData, "id" | "completed" | "type">