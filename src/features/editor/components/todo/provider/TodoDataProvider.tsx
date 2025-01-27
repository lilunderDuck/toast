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
  // ...
  cache$: CachedSectionData
  sectionTodoLookup$: SectionTodoSignals
}

const Context = createContext<ITodoDataContext>()

export function TodoDataProvider(props: ParentProps<{
  data: ITodoBlockRoot
}>) {
  const inputData = props.data.dataIn$.stuff
  const defaultData = {
    uncategorized: {
      id: 'uncategorized',
      todo: []
    }
  } satisfies TodoSavedData["stuff"]

  const cachedData = convertObjectToMap(inputData ?? defaultData) as CachedSectionData

  const [sections, setSection] = createSignal<StripedTodoSectionData[]>([])
  const sectionTodoLookup = {} as SectionTodoSignals
  for (const section of cachedData.values()) {
    sectionTodoLookup[section.id] = createSignal(section.todo ?? [])
    setSection(prev => [...prev, section])
  }

  const [data, setData] = props.data.dataOut$
  const saveData = () => {
    setData({
      title: '',
      stuff: convertMapToObject(cachedData)
    })

    console.log('data saved', data())
  }

  // make sure to call this so it correctly shows on readonly mode
  saveData()

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
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTodoDataContext() {
  return useContext(Context)!
} 