import { onMount } from "solid-js"
import { MERGE_CLASS, RANDOM_STRING } from "macro-def"
import { FloatingMenuPlugin, type FloatingMenuPluginProps } from "@tiptap/extension-floating-menu"
import { BubbleMenuPlugin, type BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
import "./Editor.css"
// ...
import { SolidEditorContent } from "~/libs/solid-tiptap-renderer"
// ...
import { AttributeEditor, BubbleMenu, FloatingMenu } from "../components"
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

  onMount(() => {
    editor$().registerPlugin(
      FloatingMenuPlugin({
        editor: editor$(),
        pluginKey: RANDOM_STRING(2),
        element: floatingMenuRef,
        tippyOptions: {
          arrow: true,
          interactive: true,
          placement: "bottom"
        }
      })
    )

    editor$().registerPlugin(
      BubbleMenuPlugin({
        editor: editor$(),
        pluginKey: RANDOM_STRING(2),
        element: bubbleMenuRef,
        tippyOptions: {
          arrow: true,
          interactive: true,
        }
      })
    )
  })

  return (
    <>
      <AttributeEditor />
      <SolidEditorContent
        editor={editor$()}
        style={`--sb-track-color: var(--gray2)`}
        spellcheck="false"
        class={MERGE_CLASS(
          stylex.attrs(style.editor),
          __scrollbarStyle.scrollbar,
          __scrollbarStyle.scrollbarVertical
        )}
      />
      <BubbleMenu ref={bubbleMenuRef} />
      <FloatingMenu ref={floatingMenuRef} />
    </>
  )
}