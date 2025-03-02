import { Text } from "./Text"
import { IBlockSetting, useEditorContext } from "../../provider"
import { InputTextData, TextData, TextDataProvider } from "./provider"

export function createTextBlock(): IBlockSetting<InputTextData> {
  return {
    displayName$: "Text",
    get defaultValue$() {
      return {
        text: [
          { text: '' }
        ] as TextData[]
      }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()
      return (
        <TextDataProvider inputData$={props.dataIn$} onChange$={(textData) => {
          blocks$.saveBlockData$(props.blockId$, {
            text: textData
          })
        }}>
          <Text />
        </TextDataProvider>
      )
    }
  }
}