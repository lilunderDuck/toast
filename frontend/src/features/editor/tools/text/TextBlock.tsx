import { Text } from "./Text"
import { IBlockSetting, useEditorContext } from "../../provider"
import { TextData, TextDataProvider } from "./provider"

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
        <TextDataProvider inputData$={props.dataIn$} onChange$={(textData) => {
          blocks$.saveBlockData$(props.blockId$, textData)
        }}>
          <Text />
        </TextDataProvider>
      )
    }
  }
}