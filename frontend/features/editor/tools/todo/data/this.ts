export interface ITodoBlockData {
  todos: TodoSectionData[]
}

export type TodoSchema = {
  name: string
  description?: string
}

export type TodoSectionSchema = {
  name: string
}

export type TodoData = {
  name: string
  description?: string
  id: number
}

export type TodoSectionData = {
  name: string
  id: number
  todo: TodoData[]
}