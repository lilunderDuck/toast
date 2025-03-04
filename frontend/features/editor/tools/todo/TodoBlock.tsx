import { IBlockSetting, useEditorContext } from "../../provider"
import { ITodoBlockData, TodoDataProvider, UncategorizedTodoSectionData } from "./data"
import { TodoSectionList } from "./ui"

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