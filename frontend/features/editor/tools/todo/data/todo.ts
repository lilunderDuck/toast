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

    //debug-start
    editorLog.logLabel("todo", "Created new todo data", newTodoData, "from section", fromSectionId)
    //debug-end
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

    //debug-start
    editorLog.logLabel("todo", "Created new todo section data", newSectionData)
    //debug-end
    update()
  }

  const updateTodoData: ITodoUtils["updateTodo$"] = (fromSectionId, todoId, newData) => {
    setData(
      "stuff", 
      (it) => it.id === fromSectionId, 
      "todo", 
      (todos) => arrayObjects(todos).replace$(it => it.id === todoId, newData)
    )

    //debug-start
    editorLog.logLabel("todo", "Todo", todoId, "from section id", fromSectionId, "updated with", newData)
    //debug-end
    update()
  }

  const updateSectionData: ITodoUtils["updateSection$"] = (sectionId, newData) => {
    setData("stuff", (it) => it.id === sectionId, 'name', newData.name)
    //debug-start
    editorLog.logLabel("todo", "Todo section id", sectionId, "updated with", newData)
    //debug-end
    update()
  }

  const deleteTodoData: ITodoUtils["deleteTodo$"] = (fromSectionId, todoId) => {
    setData(
      "stuff", 
      (it) => it.id === fromSectionId, 
      "todo", 
      (todos) => arrayObjects(todos).remove$('id', todoId)
    )

    //debug-start
    editorLog.logLabel("todo", "Todo", todoId, "from", fromSectionId, "deleted")
    //debug-end

    update()
  }

  const deleteSectionData: ITodoUtils["deleteSection$"] = (sectionId) => {
    //debug-start
    setData("stuff", (sections) => arrayObjects(sections).remove$('id', sectionId))
    //debug-end
    editorLog.logLabel("todo", "Todo section id", sectionId, "deleted")
    update()
  }
  
  const updateTitle: ITodoUtils["updateTitle$"] = (newTitle) => {
    setData("title", newTitle)
    //debug-start
    editorLog.logLabel("todo", "Updated this todo title to", newTitle)
    //debug-end
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