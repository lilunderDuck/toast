import type { Accessor } from "solid-js"
import type { ITodoBlockData, TodoSchema, TodoSectionData, TodoSectionSchema } from "../TodoBlock"
import { getRandomNumberFrom, thisArrayObjects } from "~/common"
import { editor_logWithLabel } from "~/features/editor/utils"
import type { ITodoDataProviderProps } from "./TodoDataProvider"
import { createStore, produce } from "solid-js/store"

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

    editor_logWithLabel("todo", "Created new todo data", newTodoData, "from section", fromSectionId)
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

    editor_logWithLabel("todo", "Created new todo section data", newSectionData)
    update()
  }

  const updateTodoData: ITodoUtils["updateTodo$"] = (fromSectionId, todoId, newData) => {
    setData(
      "stuff", 
      (it) => it.id === fromSectionId, 
      "todo", 
      (todos) => thisArrayObjects(todos).replace$(it => it.id === todoId, newData)
    )

    editor_logWithLabel("todo", "Todo", todoId, "from section id", fromSectionId, "updated with", newData)
    update()
  }

  const updateSectionData: ITodoUtils["updateSection$"] = (sectionId, newData) => {
    setData("stuff", (it) => it.id === sectionId, 'name', newData.name)
    editor_logWithLabel("todo", "Todo section id", sectionId, "updated with", newData)
    update()
  }

  const deleteTodoData: ITodoUtils["deleteTodo$"] = (fromSectionId, todoId) => {
    setData(
      "stuff", 
      (it) => it.id === fromSectionId, 
      "todo", 
      (todos) => thisArrayObjects(todos).remove$('id', todoId)
    )

    editor_logWithLabel("todo", "Todo", todoId, "from", fromSectionId, "deleted")

    update()
  }

  const deleteSectionData: ITodoUtils["deleteSection$"] = (sectionId) => {
    setData("stuff", (sections) => thisArrayObjects(sections).remove$('id', sectionId))
    editor_logWithLabel("todo", "Todo section id", sectionId, "deleted")
    update()
  }
  
  const updateTitle: ITodoUtils["updateTitle$"] = (newTitle) => {
    setData("title", newTitle)
    editor_logWithLabel("todo", "Updated this todo title to", newTitle)
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