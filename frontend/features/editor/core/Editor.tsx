import { onMount } from "solid-js"
import { macro_mergeClassnames } from "macro-def"
import { type FloatingMenuPluginProps } from "@tiptap/extension-floating-menu"
import { BubbleMenuPlugin, type BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
import "./Editor.css"
// ...
import { SolidEditorContent } from "~/libs/solid-tiptap-renderer"
// ...
import { AttributeEditor, BubbleMenu } from "../components"
import { useEditorContext } from "../provider"

const style = stylex.create({
  editor: {
    paddingInline: 10,
    maxHeight: 'calc(100vh - 85px)',
    paddingBottom: '20rem',
  }
})

export function Editor() {
  const { editor$ } = useEditorContext()

  let bubbleMenuRef!: Ref<"div">
  let floatingMenuRef!: Ref<"div">

  const getOption = (element: HTMLElement): FloatingMenuPluginProps | BubbleMenuPluginProps => ({
    editor: editor$(),
    pluginKey: crypto.randomUUID(),
    element: element,
    tippyOptions: {
      arrow: true,
      interactive: true,
    }
  })

  window.insertTable = () => editor$().chain().focus().insertTable$().run()

  onMount(() => {
    // editor$().registerPlugin(
    // @ts-ignore - stop yelling at me, typescript
    // FloatingMenuPlugin(getOption(floatingMenuRef))
    // )

    editor$().registerPlugin(
      BubbleMenuPlugin(getOption(bubbleMenuRef))
    )
  })

  return (
    <>
      <AttributeEditor />
      <SolidEditorContent
        editor={editor$()}
        style={`--sb-track-color: var(--gray2)`}
        class={macro_mergeClassnames(
          stylex.attrs(style.editor),
          __scrollbarStyle.scrollbar,
          __scrollbarStyle.scrollbarVertical
        )}
      />
      <BubbleMenu ref={bubbleMenuRef} />
    </>
  )
}