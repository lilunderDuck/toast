import { type TextData, Text } from "../components"
import { IBlockSetting, useEditorContext } from "../provider"

export function createTextBlock(): IBlockSetting<TextData[]> {
  return {
    displayName$: "Text",
    get defaultValue$() {
      return [
        { text: '' }
      ]
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()
      return (
        <div>
          <Text 
            onChange$={(textData) => {
              blocks$.saveBlockData$(props.blockId$, textData)
            }} 
            dataIn$={props.dataIn$} 
          />
        </div>
      )
    }
  }
}