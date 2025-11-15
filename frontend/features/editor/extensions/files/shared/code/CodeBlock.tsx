import { onMount, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./CodeBlock.module.css"
import "highlight.js/styles/atom-one-dark.css"
// ...
import { useEditorContext } from "~/features/editor/provider"
// ...
import { LANGUAGE_MAPPING, useCodeBlockContext, type LanguageName } from "./provider"
import { CodeBlockContent, CodeBlockInput, CodeBlockLanguageSelect, type ICodeBlockContentProps } from "./components"
import hljs from "highlight.js/lib/core"

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

  const highlightCodeBlock = async () => {
    const languageName = data$().lang
    if (!languageName || languageName === "text") {
      return
    }

    console.assert(
      inputRef.className.includes("language"),
      `"${inputRef}" missing a class with a "language-*" prefix, this will break the highlighting`
    )

    if (inputRef.dataset.highlighted === "yes") {
      inputRef.dataset.highlighted = "no"
    }

    try {
      hljs.highlightElement(inputRef)
    } catch (error) {
      console.warn("[anti-crash] failed to highlight code\n", error)

      const rule = LANGUAGE_MAPPING[languageName]
      console.assert(rule, `"${languageName}" did not exist in the mapping: LANGUAGE_MAPPING`)

      hljs.registerLanguage(languageName as string, (await rule()).default)
      hljs.highlightElement(inputRef)
    }
  }

  const onSelectLanguage = (lang: LanguageName) => {
    updateData$({ lang })
    if (!isShowingInput$()) {
      highlightCodeBlock()
    }
  }

  const onExitingInput = (content: string) => {
    updateData$({ codeContent: content })
    highlightCodeBlock()
  }

  onMount(highlightCodeBlock)

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