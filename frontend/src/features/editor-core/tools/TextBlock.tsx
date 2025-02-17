import { type TextData, Text } from "../components"
import { IBlockSetting, useEditorContext } from "../provider"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  block: {
    width: '100%'
  }
})

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
        <div {...stylex.attrs(style.block)}>
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