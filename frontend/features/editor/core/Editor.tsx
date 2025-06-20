import { For, onMount } from "solid-js"
import {
  BsBlockquoteLeft,
  BsCheck2Square,
  BsSubscript,
  BsSuperscript,
  BsTable,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline
} from "solid-icons/bs"
import {
  RiEditorH1,
  RiEditorH2,
  RiEditorH3,
  RiEditorH4,
  RiEditorH5,
  RiEditorH6
} from 'solid-icons/ri'
import { FloatingMenuPlugin } from "@tiptap/extension-floating-menu"
import { BubbleMenuPlugin } from "@tiptap/extension-bubble-menu"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/assets/style/scrollbar.module.css"
import "./Editor.css"
// ...
import { Button, ButtonSizeVariant, Flex, Tooltip } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import { SolidEditorContent } from "../components"
import { useEditorContext } from "../provider"

const style = stylex.create({
  bubbleMenu: {
    gap: 5,
    marginTop: '3rem'
  },
  editor: {
    paddingInline: 10,
    maxHeight: 'calc(100vh - 85px)',
    paddingBottom: '20rem'
  },
})

export function Editor() {
  const { editor$ } = useEditorContext()

  const editorChain = () => editor$().chain().focus()
  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => editorChain().toggleHeading({
    level: level
  }).run()

  const menuOptions = [
    { name$: "bold", icon$: BsTypeBold, run$: () => editorChain().toggleBold().run() },
    { name$: "italic", icon$: BsTypeItalic, run$: () => editorChain().toggleItalic().run() },
    { name$: "strikethrough", icon$: BsTypeStrikethrough, run$: () => editorChain().toggleStrike().run() },
    { name$: "blockquote", icon$: BsBlockquoteLeft, run$: () => editorChain().toggleBlockquote().run() },
    { name$: "heading 1", icon$: RiEditorH1, run$: () => toggleHeading(1) },
    { name$: "heading 2", icon$: RiEditorH2, run$: () => toggleHeading(2) },
    { name$: "heading 3", icon$: RiEditorH3, run$: () => toggleHeading(3) },
    { name$: "heading 4", icon$: RiEditorH4, run$: () => toggleHeading(4) },
    { name$: "heading 5", icon$: RiEditorH5, run$: () => toggleHeading(5) },
    { name$: "heading 6", icon$: RiEditorH6, run$: () => toggleHeading(6) },
    { name$: "subscript", icon$: BsSubscript, run$: () => editorChain().toggleSubscript().run() },
    { name$: "superscript", icon$: BsSuperscript, run$: () => editorChain().toggleSuperscript().run() },
    { name$: "underline", icon$: BsTypeUnderline, run$: () => editorChain().toggleUnderline().run() },
  ]

  const floatingMenuOptions = [
    { name$: "table", icon$: BsTable, run$: () => editorChain().insertTable().run() },
    { name$: "todo", icon$: BsCheck2Square, run$: () => editorChain().toggleTaskList().run() },
    { name$: "blockquote", icon$: BsBlockquoteLeft, run$: () => editorChain().toggleBlockquote().run() },
    { name$: "heading 1", icon$: RiEditorH1, run$: () => toggleHeading(1) },
    { name$: "heading 2", icon$: RiEditorH2, run$: () => toggleHeading(2) },
    { name$: "heading 3", icon$: RiEditorH3, run$: () => toggleHeading(3) },
    { name$: "heading 4", icon$: RiEditorH4, run$: () => toggleHeading(4) },
    { name$: "heading 5", icon$: RiEditorH5, run$: () => toggleHeading(5) },
    { name$: "heading 6", icon$: RiEditorH6, run$: () => toggleHeading(6) },
  ]

  let bubbleMenuRef!: Ref<"div">
  let floatingMenuRef!: Ref<"div">

  const getOption = (element: HTMLElement) => ({
    editor: editor$(),
    pluginKey: crypto.randomUUID(),
    element: element,
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
      <SolidEditorContent editor={editor$()} class={mergeClassname(
        stylex.attrs(style.editor),
        __scrollbarStyle.scrollbar,
        __scrollbarStyle.scrollbarVertical
      )} />
      <Flex {...stylex.attrs(style.bubbleMenu)} ref={bubbleMenuRef}>
        <For each={menuOptions}>
          {it => (
            <Tooltip label$={it.name$}>
              <Button size$={ButtonSizeVariant.icon} onClick={it.run$}>
                <it.icon$ />
              </Button>
            </Tooltip>
          )}
        </For>
      </Flex>
      <Flex {...stylex.attrs(style.bubbleMenu)} ref={floatingMenuRef}>
        <For each={floatingMenuOptions}>
          {it => (
            <Tooltip label$={it.name$}>
              <Button size$={ButtonSizeVariant.icon} onClick={it.run$}>
                <it.icon$ />
              </Button>
            </Tooltip>
          )}
        </For>
      </Flex>
    </>
  )
}