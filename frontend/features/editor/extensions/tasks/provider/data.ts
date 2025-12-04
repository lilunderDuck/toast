import type { BaseTreeAdditionalData, TreeData } from "~/features/tree-view"

export type TaskData = {
  type: TaskType.TASK
  name: string
  description?: string
  completed: boolean
} & BaseTreeAdditionalData

export type TaskSectionData = {
  type: TaskType.SECTION
  name: string
} & BaseTreeAdditionalData

export const DEFAULT_TASK_DATA = {
  [TaskType.TASK]: () => ({
    name: "",
    completed: false,
    type: TaskType.TASK
  }),
  [TaskType.SECTION]: () => ({
    name: "Untitled section",
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
  tasks: TreeData<AnyTaskData>
}

export type TaskInputSchema = Omit<TaskData, "id" | "completed" | "type">