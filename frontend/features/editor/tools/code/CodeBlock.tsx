import { getRandomNumberFrom } from "~/utils"
// ...
import { IBlockSetting, useEditorContext } from "../../provider"
import { lazy } from "solid-js"

export interface ICodeBlockData {
  code: string
} 

export function createCodeBlock(): IBlockSetting<ICodeBlockData> {
  const CodeTextarea = lazy(() => import("./CodeTextarea"))

  return {
    displayName$: "Code",
    get defaultValue$() {
      return {
        code: ''
      }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()

      return (
        <CodeTextarea 
          dataIn$={props.dataIn$} 
          onChange$={(code) => {
            console.log(code)
          }} 
        />
      )
    }
  }
}