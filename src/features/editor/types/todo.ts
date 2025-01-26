export type TodoSectionSchema = {
  name: string
}

export type TodoSchema = {
  name: string
  description?: string
}

export interface IUncategorizedTodoSection {
  id: 'uncategorized'
  todo: ITodo[]
}

export interface ITodoSection extends TodoSectionSchema {
  id: number
  todo: ITodo[]
}

export interface ITodo extends TodoSchema {
  id: number
}

export type AnyTodoSection = IUncategorizedTodoSection | ITodoSection
export type TodoSectionId = AnyTodoSection["id"]

export type TodoSavedData = {
  title: string
  stuff: Record<TodoSectionId, AnyTodoSection>
}