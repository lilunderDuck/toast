import { IBlockSetting, useEditorContext } from "../../provider"
import { TodoDataProvider } from "./data"
import { TodoSectionList } from "./ui"

export type TodoSchema = {
  name: string
  description?: string
}

export type TodoSectionSchema = {
  name: string
}

export type TodoData = TodoSchema & {
  id: number
}

export type UncategorizedTodoSectionData = {
  id: -1337
  todo: TodoData[]
}

export type TodoSectionData = TodoSectionSchema & {
  id: number
  todo: TodoData[]
}

export type AnyTodoSection = UncategorizedTodoSectionData | TodoSectionData

export interface ITodoBlockData {
  title: string
  stuff: AnyTodoSection[]
}

export function createTodoBlock(): IBlockSetting<ITodoBlockData> {
  return {
    displayName$: "Todo",
    get defaultValue$() {
      return {
        title: '',
        stuff: [
          { id: -1337, todo: [] } as UncategorizedTodoSectionData,
        ]
      }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()
      return (
        <TodoDataProvider 
          dataIn$={props.dataIn$} 
          onChange$={(value) => {
            blocks$.saveBlockData$(props.blockId$, value)
            console.log(value)
          }}
        >
          <TodoSectionList />
        </TodoDataProvider>
      )
    }
  }
}