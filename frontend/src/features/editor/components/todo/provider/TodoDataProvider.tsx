import { 
  type Accessor, 
  createContext, 
  createSignal, 
  type ParentProps, 
  Signal, 
  useContext 
} from "solid-js"
// ...
import { 
  convertMapToObject, 
  convertObjectToMap,
} from "~/common"
import type { 
  ITodo, 
  ITodoSection, 
  TodoSavedData, 
  TodoSchema, 
  TodoSectionId, 
  TodoSectionSchema
} from "~/features/editor/types"
import { 
  changeSomeTodoToEditMode, 
  createSectionData, 
  createTodoData, 
  deleteTodoData, 
  updateTodoData 
} from "~/features/editor/utils"
// ...
import type { 
  ITodoBlockRoot 
} from "../TodoBlockRoot"
import { createStorage, updateStorage } from "~/utils"

export type CachedSectionData = Map<TodoSectionId, ITodoSection>
export type StripedTodoSectionData = Omit<ITodoSection, 'todo'>
export type SectionTodoSignals = Record<TodoSectionId, Signal<ITodo[]>>

export interface ITodoDataContext extends ITodoBlockRoot {
  createTodo$(toSection: TodoSectionId, data: TodoSchema): void
  createSection$(data: TodoSectionSchema): void
  updateTodo$(fromSection: TodoSectionId, id: number, newData: TodoSchema): void
  updateSection$(fromSection: TodoSectionId, id: number, newData: TodoSchema): void
  deleteTodo$(fromSection: TodoSectionId, id: number): void
  deleteSection$(whichSection: TodoSectionId): void
  sections$: Accessor<StripedTodoSectionData[]>
  // ...
  setSomeTodoToEditMode$(fromSection: TodoSectionId, id: number, isEditMode: boolean): void
  toggleMarkTodoAsCompleted$(fromSection: TodoSectionId, todoId: number, state: boolean): void
  isThisTodoCompleted$(fromSection: TodoSectionId, todoId: number): boolean
  // ...
  cache$: CachedSectionData
  sectionTodoLookup$: SectionTodoSignals
}

const Context = createContext<ITodoDataContext>()

export function TodoDataProvider(props: ParentProps<{
  data: ITodoBlockRoot
}>) {
  const inputData = props.data.dataIn$.stuff ?? {
    uncategorized: {
      id: 'uncategorized',
      todo: []
    }
  }

  // console.log(Object.keys(inputData ?? defaultData))

  const cachedData = convertObjectToMap(inputData) as CachedSectionData

  const [sections, setSection] = createSignal<StripedTodoSectionData[]>([])
  const sectionTodoLookup = {} as SectionTodoSignals
  for (const section of cachedData.values()) {
    sectionTodoLookup[section.id] = createSignal(section.todo ?? [])
    setSection(prev => [...prev, section])
  }

  const [data, setData] = props.data.dataOut$
  const saveData = () => {
    setData(prev => ({
      title: prev?.title ?? '',
      stuff: convertMapToObject(cachedData)
    }))

    console.log('data saved', data(), cachedData)
  }

  // make sure to call this so it correctly shows on readonly mode
  saveData()

  const wrappedLocalStorage = createStorage<{
    [key: `todo-${string}`]: string
  }>(localStorage)

  return (
    <Context.Provider value={{
      ...props.data,
      cache$: cachedData,
      sectionTodoLookup$: sectionTodoLookup,
      sections$: sections,
      createTodo$(toSection, data) {
        const [, setTodos] = sectionTodoLookup[toSection]
        const newData = createTodoData(cachedData, toSection, data)
        setTodos(prev => [...prev, newData])
        saveData()
      },
      updateTodo$(fromSection, id, newData) {
        const [, setTodos] = sectionTodoLookup[fromSection]
        setTodos(prev => updateTodoData(cachedData, fromSection, prev, id, newData))
        saveData()
      },
      createSection$(data) {
        const sectionData = createSectionData(cachedData, data.name)
        sectionTodoLookup[sectionData.id] = createSignal(sectionData.todo)
        setSection(prev => [...prev, sectionData])
        saveData()
      },
      deleteTodo$(fromSection, id) {
        const [, setTodos] = sectionTodoLookup[fromSection]
        const newTodos = deleteTodoData(cachedData, fromSection, id)
        if (!newTodos) return

        setTodos(newTodos)
        saveData()
      },
      updateSection$(fromSection, id, newData) {
        // ...
      },
      deleteSection$(whichSection) {
        // ...
      },
      setSomeTodoToEditMode$(fromSection, id, isEditMode) {
        const [, setTodos] = sectionTodoLookup[fromSection]
        setTodos(prev => [...changeSomeTodoToEditMode(prev, id, isEditMode)])
      },
      toggleMarkTodoAsCompleted$(fromSection, todoId, isCompleted) {
        updateStorage(wrappedLocalStorage, `todo-${fromSection}`, (prev) => {
          if (!prev) {
            prev = ''
          }

          if (isCompleted) {
            return `${prev} ${todoId}`.trim()
          }

          return prev!.replaceAll(`${todoId}`, '').trim()
        })
      },
      isThisTodoCompleted$(fromSection, todoId) {
        return wrappedLocalStorage.get$(`todo-${fromSection}`)?.includes(`${todoId}`) ?? false
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoDataContext() {
  return useContext(Context)!
} 