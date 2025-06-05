import { Show } from "solid-js"
// ...
import { ResizableTextarea } from "~/components"
import { useEditorContext } from "~/features/editor/provider"
// ...
import __style from "./Text.module.css"
import stylex from "@stylexjs/stylex"
// ...
import { useTextDataContext, TextDataProvider, ITextProviderProps } from "./provider"
import TextRenderer from "./TextRenderer"
import { createProcessor } from "./utils"


const style = stylex.create({
  textarea: {
    maxWidth: "100% !important"
  }
})

export function Text(props: ITextProviderProps) {
  const { isReadonly$ } = useEditorContext()

  const processor = createProcessor()

  const Content = () => {
    const { textsData$, handleKeyInput$, handleInput$ } = useTextDataContext()

    return (
      <Show when={isReadonly$()} fallback={
        <>
          <ResizableTextarea 
            {...stylex.attrs(style.textarea)}
            value={textsData$()} 
            onInput={handleInput$}
            onKeyDown={handleKeyInput$}
          />
        </>
      }>
        <TextRenderer markdownAst={processor.parse(textsData$())} />
      </Show>
    )
  }

  return (
    <TextDataProvider {...props}>
      <Content />
    </TextDataProvider>
  )
}