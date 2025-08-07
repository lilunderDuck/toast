import { onMount } from "solid-js"
import { FloatingMenuPlugin, FloatingMenuPluginProps } from "@tiptap/extension-floating-menu"
import { BubbleMenuPlugin, BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
import "./Editor.css"
// ...
import { mergeClassname } from "~/utils"
// ...
import { AttributeEditor, BubbleMenu, FloatingMenu, SolidEditorContent } from "../components"
import { useEditorContext } from "../provider"

const style = stylex.create({
  bubbleMenu: {
    gap: 5,
    flexFlow: "column",
  },
  editor: {
    paddingInline: 10,
    maxHeight: 'calc(100vh - 85px)',
    paddingBottom: '20rem',
  },
  floatingMenu: {
    height: "10rem"
  },
  menuName: {}
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
      hideOnClick: "toggle",
    }
  })

  onMount(() => {
    editor$().registerPlugin(
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
        class={mergeClassname(
          stylex.attrs(style.editor),
          __scrollbarStyle.scrollbar,
          __scrollbarStyle.scrollbarVertical
        )} 
      />
      <BubbleMenu 
        {...stylex.attrs(style.bubbleMenu)}
        ref={bubbleMenuRef}
        toggleHeading$={toggleHeading}
      />
      <FloatingMenu 
        {...stylex.attrs(style.bubbleMenu, style.floatingMenu)}
        ref={floatingMenuRef} 
        toggleHeading$={toggleHeading}
      />
    </>
  )
}