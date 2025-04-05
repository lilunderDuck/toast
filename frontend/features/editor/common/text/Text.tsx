import { For, lazy, Match, Show, Switch } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Text.module.css"
// ...
import { FlexCenterY } from "~/components"
import { useEditorContext } from "~/features/editor/provider"
// ...
import { TextInput, TextInputButtonRow } from "./ui"
import { useTextDataContext, TextDataAttribute, TextOption, TextDataProvider, ITextProviderProps } from "./provider"
import { BreakLine } from "./components"

const style = stylex.create({
  texts: {
    flexWrap: 'wrap'
  },
  textGap: {
    gap: 10,
  }
})

export function Text(props: ITextProviderProps) {
  const { isReadonly$ } = useEditorContext()

  return (
    <FlexCenterY {...stylex.attrs(
      style.texts,
      isReadonly$() ? {} : style.textGap
    )}>
      <TextDataProvider {...props}>
        <TextContent />
      </TextDataProvider>
    </FlexCenterY>
  )
}

function TextContent() {
  const { isReadonly$ } = useEditorContext()
  const { textsData$ } = useTextDataContext()
  const TextRenderer = lazy(() => import("./TextRenderer"))

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
          <Match when={it === TextDataAttribute.newLine}>
            <BreakLine />
          </Match>
        </Switch>
      )}
    </For>
  )
}