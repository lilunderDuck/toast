import { getRandomNumberFrom, mergeObjects, thisArrayObjects } from "client/common"
import type { ITodo, ITodoSection, TodoSchema, TodoSectionId } from "../types"

export type ThisTodo = ITodo & {
  isEditing$?: boolean
}

export function changeSomeTodoToEditMode(todos: ThisTodo[], id: number, state: boolean) {
  const todosArray = thisArrayObjects(todos)
  const [thatTodo] = todosArray.find$(it => it.id === id)

  const newTodos = todosArray.replace$(it => it.id === id, {
    ...thatTodo,
    isEditing$: state,
  })

  return newTodos
}

export function updateTodoData(
  cachedData: CachedSectionData, 
  fromSection: TodoSectionId, 
  listOfTodo: ThisTodo[],
  id: number, 
  newData: TodoSchema
) {
  const todosArray = thisArrayObjects(listOfTodo)
  const [thatTodo] = todosArray.find$(it => it.id === id)

  delete thatTodo.isEditing$

  const newSavedData = {
    ...thatTodo,
    ...newData
  }

  const newTodos = todosArray.replace$(it => it.id === id, newSavedData)

  const dataFromCache = cachedData.get(fromSection)!
  dataFromCache.todo = newTodos 

  cachedData.set(fromSection, dataFromCache)

  return newTodos
}

export function makeTodoId() {
  return getRandomNumberFrom(1, 999_999_999_999)
}

export type CachedSectionData = Map<TodoSectionId, ITodoSection>
export function createTodoData(cachedData: CachedSectionData, toSection: TodoSectionId, data: TodoSchema) {
  let dataFromCache = cachedData.get(`${toSection}`)
  if (!dataFromCache) {
    dataFromCache = cachedData.get(toSection)
  }

  if (!dataFromCache) {
    return console.error('Could not find section id:', toSection)
  }

  const newData = mergeObjects(data, {
    id: makeTodoId()
  })

  dataFromCache.todo.push(newData)
  cachedData.set(toSection, dataFromCache)
  return newData
}

export function createSectionData(cachedData: CachedSectionData, name: string): ITodoSection {
  const data = {
    name,
    id: makeTodoId(),
    todo: [] as ITodo[]
  }

  cachedData.set(data.id, data)

  return data
}

export function deleteTodoData(cachedData: CachedSectionData, fromSection: TodoSectionId, id: number) {
  const dataFromCache = cachedData.get(fromSection)
  if (!dataFromCache) {
    return console.error('Could not find section id:', fromSection)
  }

  const newTodos = thisArrayObjects(dataFromCache.todo).remove$('id', id)
  cachedData.set(fromSection, {
    ...dataFromCache,
    todo: newTodos
  })

  return newTodos
}