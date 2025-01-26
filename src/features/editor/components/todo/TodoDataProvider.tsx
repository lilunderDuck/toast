import { type Accessor, createContext, createSignal, type ParentProps, type Signal, useContext } from "solid-js"
// ...
import { convertMapToObject, convertObjectToMap, getRandomNumberFrom, mergeObjects, thisArrayObjects } from "~/common"
// ...
import type { ITodoBlockRoot } from "./TodoBlockRoot"
import type { ITodo, ITodoSection, TodoSavedData, TodoSchema, TodoSectionId } from "../../types"

export type TodoListSignal = Signal<ITodo[]>

export type CachedSectionData = Map<TodoSectionId, ITodoSection>

export interface ITodoDataContext extends ITodoBlockRoot {
  createTodo$(toSection: number | 'uncategorized', data: TodoSchema): ITodo
  createSection$(name: string): void
  deleteTodo$(fromSection: number | 'uncategorized', id: number): ITodo[] | void
  sections$: Accessor<ITodoSection[]>
  cache$: CachedSectionData
}

const Context = createContext<ITodoDataContext>()

export function TodoDataProvider(props: ParentProps<{
  data: ITodoBlockRoot
}>) {
  const makeSomeId = () => getRandomNumberFrom(1, 999_999_999_999)
  const inputData = props.data.dataIn$.stuff
  const cachedData = convertObjectToMap(inputData ?? {
    uncategorized: {
      id: 'uncategorized',
      todo: []
    }
  } satisfies TodoSavedData["stuff"]) as CachedSectionData
  const [sections, setSection] = createSignal([])

  for (const section of cachedData.values()) {
    setSection(prev => [...prev, section])
  }

  const [, setData] = props.data.dataOut$
  const saveData = () => {
    setData({
      title: '',
      stuff: convertMapToObject(cachedData)
    })
  }

  return (
    <Context.Provider value={{
      ...props.data,
      cache$: cachedData,
      sections$: sections,
      createTodo$(toSection, data) {
        const dataFromCache = cachedData.get(toSection)
        if (!dataFromCache) {
          return console.error('Could not find section id:', toSection)
        }

        const newData = mergeObjects(data, {
          id: makeSomeId()
        })

        dataFromCache.todo.push(newData)
        cachedData.set(toSection, dataFromCache)
        saveData()
        return newData
      },
      createSection$(name: string) {
        const data = {
          name,
          id: makeSomeId(),
          todo: [] as ITodo[]
        }

        cachedData.set(data.id, data)

        setSection(prev => [...prev, data])
        console.log('todo section created')
        saveData()
      },
      deleteTodo$(fromSection, id) {
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
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoDataContext() {
  return useContext(Context)!
} 