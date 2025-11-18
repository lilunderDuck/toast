import { onMount, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./CodeBlock.module.css"
import "highlight.js/styles/atom-one-dark.css"
// ...
import { useEditorContext } from "~/features/editor/provider"
// ...
import { highlightCodeBlock, useCodeBlockContext, type LanguageName } from "./provider"
import { CodeBlockContent, CodeBlockInput, CodeBlockLanguageSelect, type ICodeBlockContentProps } from "./components"

const style = stylex.create({
  block: {
    width: "100%",
    backgroundColor: "var(--gray3)",
    paddingBottom: 10,
    marginBottom: 20,
    borderRadius: 6
  },
  block__header: {
    paddingBlock: 10,
    paddingInline: 5,
    display: "flex",
    alignItems: "center"
  },
  block__content: {
    width: "100%",
    paddingInline: 10,
    paddingBottom: 5
  }
})

export function CodeBlock() {
  const { isReadonly$ } = useEditorContext()
  const { data$, updateData$, isShowingInput$, setIsShowingInput$ } = useCodeBlockContext()

  let inputRef!: ICodeBlockContentProps["ref"]

  const startHighlight = () => highlightCodeBlock(data$().lang, inputRef as Ref<"pre">)

  const onSelectLanguage = (lang: LanguageName) => {
    updateData$({ lang })
    if (!isShowingInput$()) {
      startHighlight()
    }
  }

  const onExitingInput = (content: string) => {
    updateData$({ codeContent: content })
    startHighlight()
  }

  onMount(startHighlight)

  const showInput = () => {
    if (!isShowingInput$()) {
      setIsShowingInput$(true)
    }
  }

  return (
    <div {...stylex.attrs(style.block)} id={__style.block}>
      <header {...stylex.attrs(style.block__header)}>
        <CodeBlockLanguageSelect
          onChange$={onSelectLanguage}
          value$={data$().lang}
        />
      </header>
      <div
        {...stylex.attrs(style.block__content)}
        onClick={showInput}
      >
        <Show when={!isReadonly$() && isShowingInput$()} fallback={
          <CodeBlockContent ref={inputRef} />
        }>
          <CodeBlockInput onExit$={onExitingInput} />
        </Show>
      </div>
    </div>
  )
}