import type { Accessor } from "solid-js"
import { createStore, produce } from "solid-js/store"
// ...
import { getRandomNumberFrom, arrayObjects } from "~/utils"
import { editorLog } from "~/features/debug"
// ...
import type { ITodoBlockData, TodoSchema, TodoSectionData, TodoSectionSchema } from "./this"
import type { ITodoDataProviderProps } from "./TodoDataProvider"

export interface ITodoUtils {
  data$: Accessor<ITodoBlockData>
  createTodo$(fromSectionId: number, data: TodoSchema): void 
  createSection$(data: TodoSectionSchema): void
  updateTodo$(fromSectionId: number, todoId: number, newData: TodoSchema): void
  updateSection$(sectionId: number, newData: Partial<TodoSectionSchema>): void
  deleteTodo$(fromSectionId: number, todoId: number): void
  deleteSection$(sectionId: number): void
  updateTitle$(newTitle: string): void
}

export function createTodo(dataIn: ITodoBlockData, onChange: ITodoDataProviderProps["onChange$"]): ITodoUtils {
  const [data, setData] = createStore(dataIn)

  const generateId = () => getRandomNumberFrom(0, 999_999_999)
  const update = () => onChange(data)

  const createTodoData: ITodoUtils["createTodo$"] = (fromSectionId, todoData) => {
    if (todoData.description === "") {
      delete todoData.description
    }

    const newTodoData = {
      ...todoData,
      id: generateId()
    }

    setData("stuff", (it) => it.id === fromSectionId, produce((sectionsData) => {
      sectionsData.todo.push(newTodoData)
    }))

    isDevMode && editorLog.logLabel("todo", "Created new todo data", newTodoData, "from section", fromSectionId)
    
    update()
  }

  const createSectionData: ITodoUtils["createSection$"] = (sectionData) => {
    const newSectionData: TodoSectionData = {
      ...sectionData,
      todo: [],
      id: generateId()
    }

    setData("stuff", produce((sectionsData) => {
      sectionsData.push(newSectionData)
    }))

    isDevMode && editorLog.logLabel("todo", "Created new todo section data", newSectionData)
    
    update()
  }

  const updateTodoData: ITodoUtils["updateTodo$"] = (fromSectionId, todoId, newData) => {
    setData(
      "stuff", 
      (it) => it.id === fromSectionId, 
      "todo", 
      (todos) => arrayObjects(todos).replace$(it => it.id === todoId, newData)
    )

    isDevMode && editorLog.logLabel("todo", "Todo", todoId, "from section id", fromSectionId, "updated with", newData)
    
    update()
  }

  const updateSectionData: ITodoUtils["updateSection$"] = (sectionId, newData) => {
    setData("stuff", (it) => it.id === sectionId, 'name', newData.name)
    isDevMode && editorLog.logLabel("todo", "Todo section id", sectionId, "updated with", newData)
    
    update()
  }

  const deleteTodoData: ITodoUtils["deleteTodo$"] = (fromSectionId, todoId) => {
    setData(
      "stuff", 
      (it) => it.id === fromSectionId, 
      "todo", 
      (todos) => arrayObjects(todos).remove$('id', todoId)
    )

    isDevMode && editorLog.logLabel("todo", "Todo", todoId, "from", fromSectionId, "deleted")
    

    update()
  }

  const deleteSectionData: ITodoUtils["deleteSection$"] = (sectionId) => {
    isDevMode && setData("stuff", (sections) => arrayObjects(sections).remove$('id', sectionId))
    
    editorLog.logLabel("todo", "Todo section id", sectionId, "deleted")
    update()
  }
  
  const updateTitle: ITodoUtils["updateTitle$"] = (newTitle) => {
    setData("title", newTitle)
    isDevMode && editorLog.logLabel("todo", "Updated this todo title to", newTitle)
    
    update()
  }

  return {
    data$: () => data,
    createTodo$: createTodoData,
    createSection$: createSectionData,
    updateTodo$: updateTodoData,
    updateSection$: updateSectionData,
    deleteTodo$: deleteTodoData,
    deleteSection$: deleteSectionData,
    updateTitle$: updateTitle
  }
}