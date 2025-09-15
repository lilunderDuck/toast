import { onMount } from "solid-js"
import { FloatingMenuPlugin, type FloatingMenuPluginProps } from "@tiptap/extension-floating-menu"
import { BubbleMenuPlugin, type BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
import "./Editor.css"
// ...
import { macro_mergeClassnames } from "macro-def"
import { SolidEditorContent } from "~/libs/solid-tiptap-renderer"
// ...
import { AttributeEditor, BubbleMenu, CharacterCount, FloatingMenu } from "../components"
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

  const editorChain = () => editor$().chain().focus()
  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => editorChain().toggleHeading({
    level: level
  }).run()

  let bubbleMenuRef!: Ref<"div">
  let floatingMenuRef!: Ref<"div">

  const getOption = (element: HTMLElement): FloatingMenuPluginProps | BubbleMenuPluginProps => ({
    editor: editor$(),
    pluginKey: crypto.randomUUID(),
    element: element,
    tippyOptions: {
      hideOnClick: "toggle"
    }
  })

  onMount(() => {
    editor$().registerPlugin(
      // @ts-ignore - stop yelling at me, typescript
      FloatingMenuPlugin(getOption(floatingMenuRef))
    )

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
      <BubbleMenu 
        ref={bubbleMenuRef}
        toggleHeading$={toggleHeading}
      />
      <FloatingMenu 
        ref={floatingMenuRef} 
        toggleHeading$={toggleHeading}
      />
      <CharacterCount />
    </>
  )
}