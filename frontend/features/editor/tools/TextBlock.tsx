import { IBlockSetting, useEditorContext } from "../provider"
import { InputTextData, TextData, Text } from "../common/text"

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
        <Text inputData$={props.dataIn$} onChange$={(textData) => {
          blocks$.saveBlockData$(props.blockId$, {
            text: textData
          })
        }} />
      )
    }
  }
}