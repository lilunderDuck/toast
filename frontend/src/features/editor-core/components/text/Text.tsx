import { For, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Text.module.css"
// ...
import { FlexCenterY } from "~/components"
import { useEditorContext } from "~/features/editor-core/provider"
// ...
import { TextRenderer } from "./TextRenderer"
import TextInput from "./TextInput"
import { TextDataProvider, useTextDataContext } from "./TextProvider"
import TextInputButtonRow from "./TextInputButtonRow"
import { TextData } from "./data"

const style = stylex.create({
  texts: {
    gap: 10,
    flexWrap: 'wrap'
  },
  textinput: {
    paddingInline: 10,
    paddingBlock: 2,
    borderRadius: 6,
    backgroundColor: 'var(--gray5)',
    willChange: 'transform',
    width: 'fit-content'
  },
  noStupidOutlineThing: {
    border: 'none',
    outline: 'none',
  }
})

interface ITextProps {
  onChange$(value: TextData[]): void
  dataIn$: TextData[]
}

export function Text(props: ITextProps) {
  const { isReadonly$ } = useEditorContext()

  const __Text = () => {
    const { textsData$ } = useTextDataContext()

    return (
      <For each={textsData$()}>
        {(it, index) => (
          <Show when={isReadonly$()} fallback={
            <TextInput
              value$={it.text}
              currentIndex$={index()}
            >
              <TextInputButtonRow currentIndex$={index()} />
            </TextInput>
          }>
            <TextRenderer {...it} />
          </Show>
        )}
      </For>
    )
  }

  return (
    <TextDataProvider inputData$={props.dataIn$} onChange$={props.onChange$}>
      <FlexCenterY {...stylex.attrs(style.texts)}>
        <__Text />
      </FlexCenterY>
    </TextDataProvider>
  )
}