import { For, Match, Show, Switch } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Text.module.css"
// ...
import { FlexCenterY } from "~/components"
import { useEditorContext } from "~/features/editor/provider"
// ...
import { TextInput, TextInputButtonRow } from "./ui"
import { useTextDataContext, TextOption, TextDataProvider, ITextProviderProps, TextType } from "./provider"
import { BreakLine } from "./components"
import TextRenderer from "./TextRenderer"

const style = stylex.create({
  texts: {
    flexWrap: 'wrap'
  },
  textGap: {
    gap: 4,
  }
})

export function Text(props: ITextProviderProps) {
  const { isReadonly$ } = useEditorContext()

  const Content = () => {
    const { THIS_TEXT_BLOCK_ID$ } = useTextDataContext()

    return (
      <FlexCenterY id={THIS_TEXT_BLOCK_ID$} {...stylex.attrs(
        style.texts,
        isReadonly$() ? {} : style.textGap
      )}>
        <TextContent />
      </FlexCenterY>
    )
  }

  return (
    <TextDataProvider {...props}>
      <Content />
    </TextDataProvider>
  )
}

function TextContent() {
  const { isReadonly$ } = useEditorContext()
  const { textsData$ } = useTextDataContext()

  return (
    <For each={textsData$()}>
      {(it, index) => (
        <Switch fallback={
          <Show when={isReadonly$()} fallback={
            <TextInput
              value$={(it as TextOption).text}
              currentIndex$={index()}
            >
              <TextInputButtonRow currentIndex$={index()} />
            </TextInput>
          }>
            <TextRenderer {...it as TextOption} />
          </Show>
        }>
          <Match when={it.type === TextType.newLine}>
            <BreakLine />
          </Match>
        </Switch>
      )}
    </For>
  )
}