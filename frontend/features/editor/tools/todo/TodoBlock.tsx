import { type IBlockSetting, useEditorContext } from "../../provider"
import { ITodoBlockData, TodoDataProvider } from "./data"
import { TodoSectionList } from "./ui"

export function createTodoBlock(): IBlockSetting<ITodoBlockData> {
  return {
    displayName$: "Todo",
    get defaultValue$() {
      return {
        todos: [
          { todo: [], name: "Unnamed section", id: 0 }
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
          }}
        >
          <TodoSectionList />
        </TodoDataProvider>
      )
    }
  }
}