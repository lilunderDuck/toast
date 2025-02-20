export enum TodoField {
  name,
  description,
  id,
  title,
  stuff,
  todo
}

export interface ITodoBlockData {
  title: string
  stuff: AnyTodoSection[]
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

export type UncategorizedTodoSectionData = {
  id: -1337
  todo: TodoData[]
}

export type TodoSectionData = {
  name: string
  id: number
  todo: TodoData[]
}

export type AnyTodoSection = UncategorizedTodoSectionData | TodoSectionData